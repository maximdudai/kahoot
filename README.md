# Kahoot 
* Under development

This project is an interactive quiz game inspired by the classic Kahoot! experience. The idea originated from a school project where our professor built a simple quiz system using a JSON file with questions and answers, displaying the final points in the console 🤣🤫. This project enhances that concept with additional features to provide a comprehensive and engaging learning tool for students.

## Features

- **Game Creation:** Users can create a game by uploading a JSON file containing questions and correct answers.
- **Real-Time Interaction:** The game supports real-time interaction, allowing multiple users to join and participate.
- **Game Control:** The game creator has control over various aspects of the game, such as:
  - Pausing the timer
  - Increasing the timer
  - Kicking a player out of the game
  - Giving a hint by removing one random incorrect option
- **Feedback:** At the end of the game, all users receive feedback on their performance, including their scores and the correct answers.

## Tech Stack
- Frontend: NextJS
- Backend: ExpressJS
- Real-time interaction: SocketIO

## JSON File Format

To create a game, users need to upload a JSON file in the following format:

```json
{
  "game": [
    {
      "question": "What is the purpose of LINQ in C#?",
      "options": [
        "Render graphics in the user interface",
        "Query and update data from different sources",
        "Manage network connections",
        "Compile code into low-level languages"
      ],
      "correct_option_index": 1
    },
    ...
  ]
}
