'use client'

import { CopyBlock, dracula } from 'react-code-blocks';
import React, { useEffect } from 'react';

type CodesnippetProps = {
  clickedOutside: () => void;
};

export const Codesnippet = React.forwardRef<HTMLDivElement, CodesnippetProps>((props, ref) => {
  const { clickedOutside } = props;
  const localRef = React.useRef<HTMLDivElement>(null);

  // If a ref is forwarded, use it, otherwise use localRef
  const combinedRef = (ref as React.RefObject<HTMLDivElement>) || localRef;

  const handleClickOutside = (e: MouseEvent) => {
    if (combinedRef.current && !combinedRef.current.contains(e.target as Node)) {
      clickedOutside();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [combinedRef]);

  return (
    <div className="codeSnippet absolute w-full flex justify-center items-center inset-0">
      <div className="codeSnippetEffect z-10 bg-black/60 inset-0 w-screen h-screen"></div>
      <div className="absolute z-20" ref={combinedRef}>
        <CopyBlock
          text={code}
          language={"javascript"}
          showLineNumbers={true}
          copied={true}
          theme={dracula}
        />
      </div>
    </div>
  );
});

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