# Andromeda

*Name subject to change*

## What This Is

Andromeda is a browser-based space 4X strategy game where you take command of a single ship and make your way through a solar system filled with competing factions. Mine resources, trade, fight, or potentially build your own faction alongside other players.

The initial goal is a single-player proof of concept. Eventually, the game will expand into a persistent multiplayer universe where actions take time to reflect the vast distances of space and light travel time.

For example:

- **Fire torpedo:** The torpedo begins its journey toward the target.
- **35 minutes later:** The torpedo reaches the target.
- **35 minutes later:** Your ship receives confirmation that the target has been hit.

The goal is to create a strategic experience that accommodates players across multiple time zones without rewarding those who have the most free time.

The focus is on long-term strategic decision-making, not busywork or playing ten hours a day.

*EVE Online for people with jobs.*

> **Note:** This project has changed scope several times. Some code and documentation may be outdated. Use GitLens to check the history and dates of relevant code before relying on it.

## How to Run

### 1. Install Dependencies

After cloning the repository, run:

```bash
npm install
```

### 2. Start the Game

Once installation is complete, run:

```bash
npm start
```

### 3. Test Account

Use the following credentials to log in:

- **Email:** `test@test.com`
- **Password:** `123456`

*Note: These are development credentials. Do not use them for production or expose them in a publicly deployed environment.*

### 4. Desktop Mode

To launch the game in desktop mode, first start the application:

```bash
npm start
```

Then, in a separate terminal, run:

```bash
npx electron .
```

## Contributing

Interested in contributing? Start by assigning yourself to a ticket, then create a branch using that ticket's name or number.

Follow the existing project conventions, and check Git history when working with code that may be outdated.

If you have questions or need help getting started, join our [Discord server](https://discord.gg/JQfTFY3MDb).

Good luck, and have fun!

## License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for details.