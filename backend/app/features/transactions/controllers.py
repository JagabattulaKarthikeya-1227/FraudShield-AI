from flask import request, jsonify
from webargs.flaskparser import parser
from app.core.errors import BadRequestException
from . import transactions_bp
from .services import TransactionService
from .schemas import TransactionCreateSchema, TransactionResponseSchema

@transactions_bp.route("", methods=["GET"])
def get_transactions():
    """
    Get all transactions
    ---
    tags:
      - Transactions
    responses:
      200:
        description: List of transactions retrieved successfully
        schema:
          type: array
          items:
            $ref: '#/definitions/TransactionResponse'
    """
    transactions = TransactionService.get_all()
    schema = TransactionResponseSchema(many=True)
    return jsonify(schema.dump(transactions)), 200


@transactions_bp.route("/<string:transaction_id>", methods=["GET"])
def get_transaction(transaction_id):
    """
    Get transaction by ID
    ---
    tags:
      - Transactions
    parameters:
      - name: transaction_id
        in: path
        type: string
        required: true
        description: The unique transaction identifier
    responses:
      200:
        description: Transaction details retrieved successfully
        schema:
          $ref: '#/definitions/TransactionResponse'
      404:
        description: Transaction not found
    """
    transaction = TransactionService.get_by_id(transaction_id)
    schema = TransactionResponseSchema()
    return jsonify(schema.dump(transaction)), 200


@transactions_bp.route("", methods=["POST"])
def create_transaction():
    """
    Submit a new transaction
    ---
    tags:
      - Transactions
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/TransactionCreate'
    responses:
      201:
        description: Transaction scored and recorded successfully
        schema:
          $ref: '#/definitions/TransactionResponse'
      400:
        description: Validation error / Bad request
    """
    json_data = request.get_json()
    if not json_data:
        raise BadRequestException("Missing request payload.")

    schema = TransactionCreateSchema()
    errors = schema.validate(json_data)
    if errors:
        raise BadRequestException("Validation errors occurred.", payload={"validation_errors": errors})

    new_tx = TransactionService.create(json_data)
    response_schema = TransactionResponseSchema()
    return jsonify(response_schema.dump(new_tx)), 201


# Register marshmallow schemas to Flasgger definition library.
# This makes '#/definitions/TransactionCreate' and '#/definitions/TransactionResponse' visible in Swagger UI.
from flasgger import Schema as FlasggerSchema
class TransactionCreate(TransactionCreateSchema, FlasggerSchema):
    pass

class TransactionResponse(TransactionResponseSchema, FlasggerSchema):
    pass
