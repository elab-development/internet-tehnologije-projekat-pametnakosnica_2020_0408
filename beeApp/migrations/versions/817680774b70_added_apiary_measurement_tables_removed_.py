"""added apiary, measurement tables, removed userbeehive

Revision ID: 817680774b70
Revises: 23ee0ff5ec69
Create Date: 2024-02-02 15:44:03.045471

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '817680774b70'
down_revision = '23ee0ff5ec69'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('apiary',
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('name', sa.String(length=20), nullable=False),
    sa.Column('location', sa.String(length=20), nullable=False),
    sa.Column('temperature', sa.Numeric(), nullable=True),
    sa.Column('humidity', sa.Numeric(), nullable=True),
    sa.Column('air_pressure', sa.Numeric(), nullable=True),
    sa.Column('user_id', sa.String(length=32), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id')
    )
    op.create_table('measurement',
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('temperature', sa.Numeric(), nullable=True),
    sa.Column('humidity', sa.Numeric(), nullable=True),
    sa.Column('air_pressure', sa.Numeric(), nullable=True),
    sa.Column('weight', sa.Numeric(), nullable=True),
    sa.Column('food_remaining', sa.Numeric(), nullable=True),
    sa.Column('beehive_id', sa.String(length=32), nullable=False),
    sa.ForeignKeyConstraint(['beehive_id'], ['beehive.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('userbeehive')
    with op.batch_alter_table('beehive', schema=None) as batch_op:
        batch_op.add_column(sa.Column('apiary_id', sa.String(length=32), nullable=False))
        batch_op.create_foreign_key('fk_beehive_apiary', 'apiary', ['apiary_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('beehive', schema=None) as batch_op:
        batch_op.drop_constraint('fk_beehive_apiary', type_='foreignkey')
        batch_op.drop_column('apiary_id')

    op.create_table('userbeehive',
    sa.Column('user_id', sa.VARCHAR(length=32), nullable=False),
    sa.Column('device_id', sa.VARCHAR(length=32), nullable=False),
    sa.Column('date', sa.DATETIME(), nullable=False),
    sa.ForeignKeyConstraint(['device_id'], ['beehive.id'], name='fk_userbeehive_beehive'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='fk_userbeehive_user'),
    sa.PrimaryKeyConstraint('user_id', 'device_id')
    )
    op.drop_table('measurement')
    op.drop_table('apiary')
    # ### end Alembic commands ###
