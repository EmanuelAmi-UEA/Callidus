import React, { useState } from 'react';
import '/src/Pagamento.css'
import {ToastContainer, toast} from 'react-toastify';

// --- FUNÇÃO AUXILIAR PARA VALIDAR CPF ---
// Esta função implementa o algoritmo oficial de validação de CPF.
function validaCPF(cpf) {
  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false; // Verifica tamanho e se todos os dígitos são iguais

  const digits = cpf.split('').map(Number);

  const calculateDigit = (slice) => {
    let sum = 0;
    for (let i = 0, j = slice.length + 1; i < slice.length; i++, j--) {
      sum += slice[i] * j;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const firstDigit = calculateDigit(digits.slice(0, 9));
  if (firstDigit !== digits[9]) return false;

  const secondDigit = calculateDigit(digits.slice(0, 10));
  return secondDigit === digits[10];
}


// --- COMPONENTES DOS FORMULÁRIOS (ATUALIZADOS) ---

const FormularioPix = ({ onSubmit, errors }) => (
  <form onSubmit={onSubmit} noValidate>
    <div className="form-group">
      <label htmlFor="nomeCompleto">Nome Completo</label>
      <input className={`input ${errors.nomeCompleto ? 'error' : ''}`} type="text" id="nomeCompleto" name="nomeCompleto" />
      {errors.nomeCompleto && <p className="error-message">{errors.nomeCompleto}</p>}
    </div>
    <div className="form-group">
      <label htmlFor="cpf">CPF</label>
      <input className={`input ${errors.cpf ? 'error' : ''}`} type="text" id="cpf" name="cpf" placeholder="000.000.000-00" />
      {errors.cpf && <p className="error-message">{errors.cpf}</p>}
    </div>
    <button type="submit" className="submit-button">Gerar QR Code</button>
  </form>
);

const FormularioCartao = ({ onSubmit, errors }) => (
  <form onSubmit={onSubmit} noValidate>
    <div className="form-group">
      <label htmlFor="numeroCartao">Número do Cartão</label>
      <input className={`input ${errors.numeroCartao ? 'error' : ''}`} type="text" id="numeroCartao" name="numeroCartao" placeholder="0000 0000 0000 0000" maxLength="19" />
      {errors.numeroCartao && <p className="error-message">{errors.numeroCartao}</p>}
    </div>
    <div className="form-group">
      <label htmlFor="nomeCartao">Nome no Cartão</label>
      <input className={`input ${errors.nomeCartao ? 'error' : ''}`} type="text" id="nomeCartao" name="nomeCartao" />
      {errors.nomeCartao && <p className="error-message">{errors.nomeCartao}</p>}
    </div>
    <div className="input-row">
      <div className="form-group">
        <label htmlFor="validade">Validade</label>
        <input className={`input ${errors.validade ? 'error' : ''}`} type="text" id="validade" name="validade" placeholder="MM/AA" />
        {errors.validade && <p className="error-message">{errors.validade}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="cvv">CVV</label>
        <input className={`input ${errors.cvv ? 'error' : ''}`} type="text" id="cvv" name="cvv" placeholder="123" maxLength="4" />
        {errors.cvv && <p className="error-message">{errors.cvv}</p>}
      </div>
    </div>
    <button type="submit" className="submit-button">Pagar com Cartão</button>
  </form>
);


// --- COMPONENTE PRINCIPAL (ATUALIZADO) ---
export default function Pagamento() {
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [errors, setErrors] = useState({}); // Estado para armazenar os erros
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  // Função central de validação
  const validate = (formData) => {
    const newErrors = {};

    // Validações para PIX e Cartão
    if (metodoPagamento === 'pix') {
      if (!formData.nomeCompleto) newErrors.nomeCompleto = 'O nome completo é obrigatório.';
      else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(formData.nomeCompleto)) newErrors.nomeCompleto = 'O nome deve conter apenas letras e espaços.';
      
      if (!formData.cpf) newErrors.cpf = 'O CPF é obrigatório.';
      else if (!validaCPF(formData.cpf)) newErrors.cpf = 'CPF inválido.';
    }

    // Validações para Cartão
    if (metodoPagamento === 'cartao') {
      const numeroCartaoLimpo = formData.numeroCartao.replace(/\s/g, '');
      if (!numeroCartaoLimpo) newErrors.numeroCartao = 'O número do cartão é obrigatório.';
      else if (!/^\d+$/.test(numeroCartaoLimpo)) newErrors.numeroCartao = 'O número do cartão deve conter apenas dígitos.';
      else if (numeroCartaoLimpo.length < 13 || numeroCartaoLimpo.length > 19) newErrors.numeroCartao = 'O número do cartão deve ter entre 13 e 19 dígitos.';

      if (!formData.nomeCartao) newErrors.nomeCartao = 'O nome no cartão é obrigatório.';
      else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(formData.nomeCartao)) newErrors.nomeCartao = 'O nome deve conter apenas letras e espaços.';
      
      if (!formData.validade) newErrors.validade = 'A data de validade é obrigatória.';
      else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.validade)) newErrors.validade = 'Formato inválido. Use MM/AA.';

      if (!formData.cvv) newErrors.cvv = 'O CVV é obrigatório.';
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'O CVV deve ter 3 ou 4 dígitos.';
    }

    return newErrors;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Limpa erros antigos

    const formData = Object.fromEntries(new FormData(e.target).entries());
    const validationErrors = validate(formData);
    
    // Se existem erros, atualiza o estado de erros e interrompe o envio
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setQrCodeVisible(false); // Esconde QR Code se houver erros
      return;
    }
    
    // Se a validação passar, continua com a lógica de negócio
    if (metodoPagamento === 'pix') {
      console.log('Dados PIX validados:', formData);
      toast('Validação OK! Gerando PIX...');
      setQrCodeVisible(true); // Exibe QR Code
      <ToastContainer/>
    } else {
      console.log('Dados do Cartão validados:', formData);
      toast('Validação OK! Processando pagamento...');
      setQrCodeVisible(false); // Esconde QR Code para pagamento com cartão
      <ToastContainer/>
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-box">
        <h2>Escolha como pagar</h2>
        <div className="method-selector">
          <button
            className={`method-button ${metodoPagamento === 'pix' ? 'active' : ''}`}
            onClick={() => { setMetodoPagamento('pix'); setErrors({}); }}
          >
            PIX
          </button>
          <button
            className={`method-button ${metodoPagamento === 'cartao' ? 'active' : ''}`}
            onClick={() => { setMetodoPagamento('cartao'); setErrors({}); }}
          >
            Cartão de Crédito/Débito
          </button>
        </div>

        {metodoPagamento === 'pix' ? (
          <>
            <FormularioPix onSubmit={handleSubmit} errors={errors} />
            {qrCodeVisible && (
              <div className="qr-code-box">
                <p>Escaneie o QR Code para pagar com Pix:</p>
                <img
                  src="/imagens/qrcodepix.jpg"
                  alt="QR Code Pix"
                  className="qr-code-image"
                />
                <p className="pix-copy-code">Chave Pix: 00020126360014br.gov.bcb.pix0114+55929915662525204000053039865802BR5925EMANUEL AMI DA SILVA HERN6009Sao Paulo62290525REC6881AD3B136E89665970116304A6BF</p>
              </div>
            )}
          </>
        ) : (
          <FormularioCartao onSubmit={handleSubmit} errors={errors} />
        )}
      </div>
    </div>
  );
}