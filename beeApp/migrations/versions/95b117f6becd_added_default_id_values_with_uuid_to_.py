"""added default id values with uuid to user and beehive

Revision ID: 95b117f6becd
Revises: 2da0004382fb
Create Date: 2024-01-27 23:13:48.460757

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '95b117f6becd'
down_revision = '2da0004382fb'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('userbeehive', schema=None) as batch_op:
        batch_op.drop_constraint('fk_userbeehive_beehive', type_='foreignkey')
        batch_op.drop_constraint('fk_userbeehive_user', type_='foreignkey')
        batch_op.create_foreign_key('fk_userbeehive_beehive', 'beehive', ['device_id'], ['id'])
        batch_op.create_foreign_key('fk_userbeehive_user', 'user', ['user_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('userbeehive', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('fk_userbeehive_user', 'user', ['user_id'], ['id'], onupdate='CASCADE', ondelete='CASCADE')
        batch_op.create_foreign_key('fk_userbeehive_beehive', 'beehive', ['device_id'], ['id'], onupdate='CASCADE', ondelete='CASCADE')

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(length=345),
               nullable=True)

    # ### end Alembic commands ###