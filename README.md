<div align="center">
  <!-- <img src="public/favicon.svg" height="50px" width="auto" />  -->
  <h3>
  The ESLAND page reimagined
  </h3>
  <p>Created for didactic and educational purposes.</p>
</div>

<div align="center">
    <a href="#-getting-started">
        Getting Started
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#-commands">
        Commands
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#-license">
        License
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="https://twitter.com/lufesarientomu">
        Twitter
    </a>
</div>

<p></p>

<div align="center">
  
  ![NestJS Badge](https://img.shields.io/badge/-NestJs-ea2845?style=flat-square&logo=nestjs&logoColor=white&style=flat)
  ![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff&style=flat)
</div>

> [!WARNING]
> This page is not official. The official page is [**premiosesland.com**](https://premiosesland.com/).

## 🛠️ Stack

- [**NestJS**](https://docs.nestjs.com/) - framework for building efficient, scalable Node.js server-side applications.
- [**Typescript**](https://www.typescriptlang.org/) - JavaScript with syntax for types.
- [**Typeorm**](https://typeorm.io/) - is an [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) 
- [**Handlebars**](https://handlebarsjs.com/) - Minimal templating for NodeJS.
- [**Passport/Passport**](https://www.passportjs.org/) - is authentication middleware for Node.js.


## 🚀 Getting Started

1. [Fork](https://github.com/LuisSarmientoM/nestjs-auth-typeorm/fork) or clone this repository.

```bash
git clone git@github.com:midudev/esland-web.git
```

2. Install the dependencies:
- I recommend use [pnpm](https://pnpm.io) but you can use npm or yarn or whatever you want:
```bash
# Install pnpm globally if you don't have it:
npm install -g pnpm

# Install dependencies:
pnpm install
```
3. Setup your environment variables:
```bash
cp .env.example .env
```

4. Before continue you need to:
   - create a database and configure the connection in the `.env` file.
   - Use a SMTP server for send emails and configure the connection in the `.env` file.
   - run 
5. Run the development server:

```bash
# Run with pnpm:
pnpm start:dev

# Run with npm:
npm run start:dev

# Run with yarn:
yarn start:dev
```
6. Open [**http://localhost:3000/docs**](http://localhost:3000/docs) for Swagger documentation 🚀


## 🧞 Commands

|     | Command          | Action                                        |
| :-- | :--------------- | :-------------------------------------------- |
| ⚙️  | `dev` or `start` | Starts local dev server at `localhost:3000`.  |
| ⚙️  | `build`          | Build your production site to `./dist/`.      |
| ⚙️  | `preview`        | Preview your build locally, before deploying. |

## 🔑 License

[MIT](#) - Created by [**midu.dev**](https://midu.dev).

## ✅ Por hacer...

- [ ] Mejorar diseño de la página "Info"
- [ ] Añadir funcionalidad de ganadores de pasadas ediciones
- [ ] Mejorar la precarga de las imágenes de las siguientes secciones en idle
- [ ] Pestaña para cambiar entre ediciones en la página "Archivo"

### 👀 Lo haremos en directo en Twitch

- [ ] Base de datos para las votaciones
- [ ] Backend para las votaciones