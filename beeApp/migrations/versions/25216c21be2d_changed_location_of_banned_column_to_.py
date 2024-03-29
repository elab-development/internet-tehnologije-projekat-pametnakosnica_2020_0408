"""changed location of banned column to user

Revision ID: 25216c21be2d
Revises: 469e86f98f13
Create Date: 2024-02-08 18:25:43.884328

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '25216c21be2d'
down_revision = '469e86f98f13'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('role', schema=None) as batch_op:
        batch_op.drop_column('banned')

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('banned', sa.Boolean(), server_default='0', nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('banned')

    with op.batch_alter_table('role', schema=None) as batch_op:
        batch_op.add_column(sa.Column('banned', sa.BOOLEAN(), server_default=sa.text("'false'"), nullable=False))

    # ### end Alembic commands ###
