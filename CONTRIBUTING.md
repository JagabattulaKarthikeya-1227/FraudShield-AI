# Contributing to FraudShield AI

First off, thank you for considering contributing to FraudShield AI! It's people like you that make FraudShield such a great tool.

## Development Setup

1. Fork the repo and create your branch from `main`.
2. Ensure you have Docker and Docker Compose installed.
3. Run `docker-compose up --build` to spin up the local stack.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, if applicable.
3. Your PR must pass all GitHub Actions CI checks (Flake8 Linting, Pytest Coverage, and Node builds).
4. You may merge in the Pull Request in once you have the sign-off of two other developers.

## Code Style

- **Python**: Follow PEP 8 guidelines. Flake8 will enforce this in the CI pipeline.
- **TypeScript**: We use strictly typed React. Ensure all props and returns are strongly typed.
