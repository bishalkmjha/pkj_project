import json

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import billing
from app.db import Base, get_db
from app.main import app

engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


@pytest.fixture
def db():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    s = TestSession()
    yield s
    s.close()


@pytest.fixture
def client(db):
    app.dependency_overrides[get_db] = lambda: db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def signup(client, email="a@example.com", password="password123"):
    r = client.post("/auth/signup", json={"email": email, "password": password})
    assert r.status_code == 201, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def send_event(client, event_type, data):
    body, sig = billing.build_event(event_type, data)
    return client.post("/webhooks/billing", content=body, headers={"X-Signature": sig})


def subscribe(client, headers, plan="pro", interval="month"):
    r = client.post("/subscription/checkout", json={"plan": plan, "interval": interval}, headers=headers)
    assert r.status_code == 200, r.text
    r2 = send_event(client, "checkout.completed", {"session_id": r.json()["session_id"]})
    assert r2.status_code == 200, r2.text
    return r.json()


@pytest.fixture
def user(client):
    return signup(client)
