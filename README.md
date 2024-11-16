# Oh, hi there!

I'm a Staff Frontend Engineer helping turn ideas into accessible experiences.

---

This is the source code of my personal website. It was a fun ride that took me around 5 months on and off during my free time. During the journey I took notes of some of my major technical [Learnings](LEARNINGS.md).

Some funny facts about it:

- All animations are CSS based powered with [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*). No libraries used.
- This is a portfolio without images or project showcase. I hope the code itself and [Codepen](https://codepen.io/sandrina-p) can make up for it.
- Designing it was way harder than implementing it!

## Run it locally

### Pre-requisites

I built this in 2019 and I haven't updated any dependency since then. Last time I ran the project successfully in Nov 2024, I had to:
- Use Node v18.20.5 (use `nvm` or `asdf` to install it)
- If you have MacOS M1/M2/M3, you'll need to solve [chromium binary issues](https://stackoverflow.com/a/66044814).

Then you are ready to:

```bash
# Install dependencies
npm install # or yarn

# Run in dev mode
npm run dev # or yarn dev

# Run tests
npm run test # or yarn test
```

## Stack

- **Development**: [Svelte 3.*](https://svelte.dev/) ([Sapper](https://sapper.svelte.dev/)) + [PostCSS](https://postcss.org/)
- **Testing**: [Cypress](https://www.cypress.io/)
- **Deploy**: [Netlify](https://www.netlify.com/)

P.S. If you _wanna_ update this to SkelveKit with Svelte 4 or 5. I'd highly appreciate it! 🧡 


## Is there something missing or wrong?

Feel free to open an issue or let me know in other ways (e-mail, blueSky, etc...). I'd appreciate! 🙌


## License

<a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />
This work is licensed under a <a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/">Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.

This is open source so you can see how it was built. Please, do not create/publish your own portfolio as a _cheap copy_ of mine. That's rude.
