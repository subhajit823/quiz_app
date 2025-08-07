import React from "react";
import axios from "axios";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "What is the name of the galaxy our solar system is in?",
    options: [" Andromeda Galaxy", "Triangulum Galaxy", "Milky Way Galaxy", "Pinwheel Galaxy"],
    answer: "Milky Way Galaxy",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
    answer: "Mars",
  },
   {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
    answer: "Leonardo da Vinci",
  },
  {
    question: "Who wrote 'To be, or not to be'?",
    options: ["Chaucer", "Shakespeare", "Milton", "Austen"],
    answer: "Shakespeare",
  },
];

class QuizComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false,
      currentQuestion: 0,
      selectedOption: null,
      score: 0,
      showScore: false,
      userAnswers: [],
      username: "",
      scoreSent: false,
      leaderboard: [],
    };
  }

  componentDidMount() {
    this.fetchLeaderboard();
  }

  fetchLeaderboard() {
    axios
      .get("http://localhost:3001/scores")
      .then((res) => {
        console.log("Fetched leaderboard:", res.data);
        this.setState({ leaderboard: res.data });
      })
      .catch((err) => {
        console.error("Failed to fetch leaderboard:", err.message);
      });
  }

  startQuiz() {
    if (this.state.username.trim() === "") {
      alert("Please enter your name before starting!");
      return;
    }
    this.setState({ started: true });
  }

  handleOptionClick(option) {
    const { currentQuestion } = this.state;
    const correctAnswer = questions[currentQuestion].answer;
    const isCorrect = option === correctAnswer;

    this.setState((prevState) => ({
      score: isCorrect ? prevState.score + 1 : prevState.score,
      selectedOption: option,
      userAnswers: [
        ...prevState.userAnswers,
        {
          question: questions[currentQuestion].question,
          selected: option,
          correct: correctAnswer,
        },
      ],
    }));

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        this.setState({
          currentQuestion: currentQuestion + 1,
          selectedOption: null,
        });
      } else {
        this.setState({ showScore: true });
      }
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showScore && !this.state.scoreSent) {
      const { username, score } = this.state;
      axios
        .post("http://localhost:3001/score", {
          username,
          score,
        })
        .then((res) => {
          console.log("✅ Score saved:", res.data);
          this.setState({ scoreSent: true });
          this.fetchLeaderboard();
        })
        .catch((err) => {
          console.error("❌ Error saving score:", err.message);
        });
    }
  }

  restartQuiz() {
    this.setState({
      started: false,
      currentQuestion: 0,
      selectedOption: null,
      score: 0,
      showScore: false,
      userAnswers: [],
      scoreSent: false,
    });
  }

  renderProgressBar() {
    const { currentQuestion } = this.state;
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }

  renderStartScreen() {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-orange-600">🧠 Welcome to the Quiz!</h1>
          <p className="mb-6 text-gray-600">Test your knowledge with this fun quiz.</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={this.state.username}
            onChange={(e) => this.setState({ username: e.target.value })}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={() => this.startQuiz()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition"
          >
            Start Quiz ▶️
          </button>
        </div>
      </div>
    );
  }

  renderLeaderboard() {
  return (
    <div className="w-full mt-8 bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-purple-700 text-center">🏆 Leaderboard</h3>
      {this.state.leaderboard.length === 0 ? (
        <p className="text-center text-gray-500">No players yet!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-purple-100 text-purple-700">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {this.state.leaderboard
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <tr
                    key={index}
                    className={`${
                      index === 0
                        ? "bg-yellow-100 font-bold"
                        : index === 1
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{player.username}</td>
                    <td className="px-4 py-2">{player.score}</td>
                    <td className="px-4 py-2">
                      {new Date(player.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


  renderScoreScreen() {
    const { score, userAnswers, username } = this.state;

    return (
      <div className="h-screen w-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-500 to-pink-500 p-4 overflow-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full mt-4">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">🎉 Quiz Results</h2>
          <p className="text-lg text-gray-700 mb-2">Name: <span className="font-bold">{username}</span></p>
          <p className="text-lg text-gray-700 mb-6">Your Score: {score} / {questions.length}</p>
          {userAnswers.map((item, index) => (
            <div key={index} className="mb-4 p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-1">Q{index + 1}: {item.question}</h4>
              <p className={item.selected === item.correct ? "text-green-600" : "text-red-600"}>
                Your Answer: {item.selected}
              </p>
              {item.selected !== item.correct && (
                <p className="text-blue-600">Correct Answer: {item.correct}</p>
              )}
            </div>
          ))}
          <button
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 mt-6 rounded-full transition"
            onClick={() => this.restartQuiz()}
          >
            Restart 🔁
          </button>
        </div>
        {this.renderLeaderboard()}
      </div>
    );
  }

  renderQuiz() {
    const { currentQuestion, selectedOption } = this.state;
    const questionObj = questions[currentQuestion];

    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-500 p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full">
          {this.renderProgressBar()}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Q{currentQuestion + 1}: {questionObj.question}</h2>
            <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          {questionObj.options.map((opt, index) => (
            <button
              key={index}
              className={`w-full text-left px-4 py-3 mb-3 rounded-lg border transition-all duration-300 shadow-sm ${
                selectedOption === opt
                  ? opt === questionObj.answer
                    ? "bg-green-400 text-white border-green-500"
                    : "bg-red-400 text-white border-red-500"
                  : "bg-gray-100 hover:bg-blue-100 text-gray-800"
              }`}
              onClick={() => this.handleOptionClick(opt)}
              disabled={selectedOption !== null}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  render() {
    if (!this.state.started) return this.renderStartScreen();
    if (this.state.showScore) return this.renderScoreScreen();
    return this.renderQuiz();
  }
}

export default QuizComponent;