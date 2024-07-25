"use client";

import { useState, useEffect } from "react";

import { MdOutlineTimer } from "react-icons/md";

export default function PlayerScreen() {
  const [timer, setTimer] = useState(30);
  const [response, setResponse] = useState(null);

  const handleQuestionResponse = (id) => {
    setResponse(id);
  };


  return (
    <div className="container">
      <div className="bg-white/30 text-white rounded-md">
        <div className="timerInformation shadow-lg shadow-black/30 border-l-[1px] border-r-[1px] border-gray-300/30 m-auto w-32 uppercase flex flex-col justify-center items-center">
          <div className="timeLeft w-full bg-white/30">
            <MdOutlineTimer className="w-10 m-auto h-auto p-2 rounded-md" />
          </div>
          <p className="text-8xl font-bold">{timer}</p>
          <p className="text-2xl w-32 bg-white/30 text-center text-white">
            seconds
          </p>
        </div>

        <div className="questionData mt-10 w-full flex justify-center items-center flex-col">
          <div className="bg-green-500 p-2 border-b-[1px] border-t-[1px] border-gray-300/20 w-full my-3">
            <p className="text-2xl text-center">
              Em C#, o que são tipos genéricos usados para?
            </p>
          </div>

          <div className="options w-full p-2">
            <ul className="w-full grid grid-cols-2 gap-2">
              <li
                id="1"
                onClick={() => handleQuestionResponse(1)}
                className={`cursor-pointer w-full min-h-20 flex items-center border-2 border-gray-800 rounded-md shadow-md text-lg p-2 ${
                  response === 1 ? "bg-green-500" : "bg-blue-600 hover:bg-blue-400"
                }`}
                disabled={timer <= 0}
              >
                Permitir a execução de código sem compilação
              </li>
              <li
                id="2"
                onClick={() => handleQuestionResponse(2)}
                className={`cursor-pointer w-full min-h-20 flex items-center border-2 border-gray-800 rounded-md shadow-md text-lg p-2 ${
                  response === 2 ? "bg-green-500" : "bg-blue-600 hover:bg-blue-400"
                }`}
                disabled={timer <= 0}
              >
                Fornecer uma forma de reutilizar uma mesma função ou classe para
                diferentes tipos de dados
              </li>
              <li
                id="3"
                onClick={() => handleQuestionResponse(3)}
                className={`cursor-pointer w-full min-h-20 flex items-center border-2 border-gray-800 rounded-md shadow-md text-lg p-2 ${
                  response === 3 ? "bg-green-500" : "bg-blue-600 hover:bg-blue-400"
                }`}
                disabled={timer <= 0}
              >
                Criar tipos que não podem ser herdados
              </li>
              <li
                id="4"
                onClick={() => handleQuestionResponse(4)}
                className={`cursor-pointer w-full min-h-20 flex items-center border-2 border-gray-800 rounded-md shadow-md text-lg p-2 ${
                  response === 4 ? "bg-green-500" : "bg-blue-600 hover:bg-blue-400"
                }`}
                disabled={timer <= 0}
              >
                Implementar funções matemáticas complexas
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="exitGame mt-1 text-center">
        <button className="bg-red-500/30 text-white text-xs uppercase p-2 shadow-md hover:bg-red-500">
          Exit Game
        </button>
      </div>
    </div>
  );
}
