"""changed data types for all the tables to match uuid - was int - now is string

Revision ID: 23ee0ff5ec69
Revises: 95b117f6becd
Create Date: 2024-01-27 23:34:36.315649

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '23ee0ff5ec69'
down_revision = '95b117f6becd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('_alembic_tmp_user')
    with op.batch_alter_table('beehive', schema=None) as batch_op:
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               type_=sa.String(length=32),
               existing_nullable=False)

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               type_=sa.String(length=32),
               existing_nullable=False)
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(length=345),
               nullable=False)

    with op.batch_alter_table('userbeehive', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(length=32),
               existing_nullable=False)
        batch_op.alter_column('device_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(length=32),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('userbeehive', schema=None) as batch_op:
        batch_op.alter_column('device_id',
               existing_type=sa.String(length=32),
               type_=sa.INTEGER(),
               existing_nullable=False)
        batch_op.alter_column('user_id',
               existing_type=sa.String(length=32),
               type_=sa.INTEGER(),
               existing_nullable=False)

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(length=345),
               nullable=True)
        batch_op.alter_column('id',
               existing_type=sa.String(length=32),
               type_=sa.INTEGER(),
               existing_nullable=False)

    with op.batch_alter_table('beehive', schema=None) as batch_op:
        batch_op.alter_column('id',
               existing_type=sa.String(length=32),
               type_=sa.INTEGER(),
               existing_nullable=False)

    op.create_table('_alembic_tmp_user',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('firstname', sa.VARCHAR(length=20), nullable=False),
    sa.Column('lastname', sa.VARCHAR(length=20), nullable=False),
    sa.Column('email', sa.VARCHAR(length=345), nullable=False),
    sa.Column('username', sa.VARCHAR(length=20), nullable=True),
    sa.Column('password', sa.VARCHAR(length=72), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###
