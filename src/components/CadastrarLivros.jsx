import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import './CadastrarLivros.css';

// Esquema de validação com Yup
const schema = Yup.object().shape({
  isbn: Yup.string()
    .required("ISBN é obrigatório")
    .matches(/^978-85-7522-\d{3}-\d$/, "Formato inválido: ex. 978-85-7522-123-4"),
  titulo: Yup.string().required("Título é obrigatório"),
  autor: Yup.string().required("Autor é obrigatório"),
});



const CadastrarLivros = ({ livro, inserirLivro, editarLivro }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      isbn: livro?.isbn || "",
      titulo: livro?.titulo || "",
      autor: livro?.autor || "",
    }
  });

  const onSubmit = (dados) => {
    const livroComId = { ...dados, id: livro?.id };

    if (livro?.id && editarLivro) {
      editarLivro(livroComId);
      toast.success("Livro atualizado com sucesso!");
    } else if (inserirLivro) {
      inserirLivro(livroComId);
      toast.success("Livro cadastrado com sucesso!");
    }

    // Redireciona após 1.5s
    setTimeout(() => navigate("/"), 1500);
  };

  useEffect(() => {
    if (isSubmitSuccessful && !livro?.id) {
      reset();
    }
  }, [isSubmitSuccessful, reset, livro]);

  const handleCancelar = () => {
    navigate("/");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <form onSubmit={handleSubmit(onSubmit)} className="meu-formulario">
        <h1>{livro?.id ? "Editar" : "Cadastrar"} livro</h1>

        <p>
          <label htmlFor="fisbn">
            ISBN: Formato - (<span style={{ color: "red" }}>978-85-7522-xxx-x</span>)
          </label>
          <input
            id="fisbn"
            className={errors.isbn ? "erro" : ""}
            autoFocus
            {...register("isbn")}
          />
          {errors.isbn && <span className="mensagem-erro">{errors.isbn.message}</span>}
        </p>

        <p>
          <label htmlFor="ftitulo">Título</label>
          <input
            id="ftitulo"
            className={errors.titulo ? "erro" : ""}
            {...register("titulo")}
          />
          {errors.titulo && <span className="mensagem-erro">{errors.titulo.message}</span>}
        </p>

        <p>
          <label htmlFor="fautor">Autor</label>
          <input
            id="fautor"
            className={errors.autor ? "erro" : ""}
            {...register("autor")}
          />
          {errors.autor && <span className="mensagem-erro">{errors.autor.message}</span>}
        </p>

        <div className="botoes-formulario">
            <button
                type="submit"
                className="botao cadastrar"
                data-tooltip-id="tooltip-cadastrar"
                data-tooltip-content={livro?.id ? "Salvar alterações deste livro" : "Cadastrar novo livro"}
            >
                {livro?.id ? "Salvar" : "Cadastrar"}
            </button>

            <button
                type="button"
                className="botao limpar"
                data-tooltip-id="tooltip-limpar"
                data-tooltip-content="Limpa todos os campos do formulário"
                onClick={() => reset()}
            >
                Limpar
            </button>

            <button
                type="button"
                className="botao cancelar"
                data-tooltip-id="tooltip-cancelar"
                data-tooltip-content="Cancelar e voltar à página inicial"
                onClick={handleCancelar}
            >
                Cancelar
            </button>

            {/* Tooltips associadas por ID */}
            <Tooltip id="tooltip-cadastrar" place="top" />
            <Tooltip id="tooltip-limpar" place="top" />
            <Tooltip id="tooltip-cancelar" place="top" />
        </div>
      </form>
    </>
  );
};

export default CadastrarLivros;