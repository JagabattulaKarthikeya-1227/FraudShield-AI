from marshmallow import Schema, fields, validate

class LoginRequestSchema(Schema):
    """Validation schema for user authentication logins."""
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))


class UserResponseSchema(Schema):
    """Serialization schema for returning profile details."""
    id = fields.Int()
    email = fields.Email()
    first_name = fields.Str()
    last_name = fields.Str()
    role = fields.Str()
    is_active = fields.Bool()
    created_at = fields.DateTime()
