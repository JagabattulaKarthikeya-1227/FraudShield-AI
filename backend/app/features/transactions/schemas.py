from marshmallow import Schema, fields, validate

class TransactionCreateSchema(Schema):
    """Validation schema for transaction registration."""
    id = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    user_id = fields.Int(required=False, allow_none=True)
    amount = fields.Float(required=True, validate=validate.Range(min=0.01))
    merchant = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    category = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    timestamp = fields.DateTime(required=False)
    card_type = fields.Str(required=True, validate=validate.OneOf(["visa", "mastercard", "amex", "discover"]))
    location_lat = fields.Float(required=False, allow_none=True)
    location_long = fields.Float(required=False, allow_none=True)


class TransactionResponseSchema(Schema):
    """Serialization schema for transaction payload responses."""
    id = fields.Str()
    user_id = fields.Int()
    amount = fields.Float()
    merchant = fields.Str()
    category = fields.Str()
    timestamp = fields.DateTime()
    card_type = fields.Str()
    location_lat = fields.Float()
    location_long = fields.Float()
    status = fields.Str()
    is_fraud = fields.Bool()
    fraud_probability = fields.Float()
    created_at = fields.DateTime()
