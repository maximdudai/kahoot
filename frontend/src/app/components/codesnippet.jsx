'use client'

import { CopyBlock, dracula } from 'react-code-blocks';

export const Codesnippet = () => {
  return (
    <CopyBlock
      text={code}
      language={'javascript'}
      showLineNumbers={true}
      copied={true}
      theme={dracula}
      wrapLines
    />
  );
}
const code = `
{
  "game": [
    {
      "question": "Qual é a finalidade principal do LINQ em C#?",
      "options": [
        "Renderizar gráficos na interface do usuário",
        "Consultar e atualizar dados de diferentes fontes",
        "Gerenciar conexões de rede",
        "Compilar código em linguagens de baixo nível"
      ],
      "correct_option_index": 1
    },
    {
      "question": "O que a palavra-chave declaração de uma variável?",
      "options": [
        "Que a variável é estaticamente tipada",
        "Que o tipo da variável será inferido pelo compilador",
        "Que a variável deve ser serializada",
        "Que a variável é de tipo dinâmico"
      ],
      "correct_option_index": 1
    }
  ]
}
`;