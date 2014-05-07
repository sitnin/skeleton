# Express 4 webapp skeleton

This repository consists webapp skeleton which can be used as a boilerplate for Express4-based web applications.

At the moment, it supports cookies, sessions (via MySQL), serving static files and nunjucks templating engine (uses Jinja2 syntax). And all this staff made with completely new Express4 paradigm.

It also uses "app" expression rather than "route" because I suppose it more convinient. Nevertheless apps is the express' Routers itself.

## Usage

1. Clone master branch of the repository

    ```bash
    $ git clone https://github.com/sitnin/skeleton.git newapp
    ```

2. Next, cleanup ``.git`` directory (you definitely don't need it)

    ```bash
    $ cd newapp
    $ rm -rf .git
    ```

3. Enjoy =)

## Contribution

Feel free to create pull-requests and so on

## License

MIT
