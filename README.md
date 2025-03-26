# DayAI - Smart Calendar Diary App

A modern web application that helps you manage your schedule and generate personalized diary entries based on your daily activities.

## Features

- User authentication (login/register)
- Calendar view with event management
- Event creation and editing
- Diary generation based on daily events
- Multi-language support (English, Simplified Chinese, Traditional Chinese)
- Responsive design
- Dark/Light theme support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- API key for the diary generation service

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/calendar-diary-app.git
cd calendar-diary-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your API key:
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_API_KEY=your_api_key_here
```

## Development

Start the development server:
```bash
npm start
# or
yarn start
```

The app will be available at `http://localhost:3000`.

## Building for Production

Build the app for production:
```bash
npm run build
# or
yarn build
```

The build output will be in the `build` directory.

## Testing

Run tests:
```bash
npm test
# or
yarn test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
