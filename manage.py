#!/usr/bin/env python
import os
from app import create_app, db, socketio
from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand
from flask import current_app
from flask_moment import Moment
from app.models import User, Scope, ScopeGlobal



app = create_app(os.getenv('FLASK_CONFIG') or 'default')
manager = Manager(app)
migrate = Migrate(app, db)


def make_shell_context():
    return dict(app=app, db=db, User=User)

manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)


@manager.command
def test():
    """Run the unit tests."""
    import unittest
    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=2).run(tests)

@manager.command
def run():
    socketio.run(app,
                host='0.0.0.0',
                port=5000,
                debug=True,
                use_reloader=True)

@manager.command
def runserver():
    socketio.run(app,
                 host='0.0.0.0',
                 port=8080,
                 debug=True,
                 use_reloader=True)

if __name__ == '__main__':
    manager.run()
