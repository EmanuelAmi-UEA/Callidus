import React, { useState } from 'react';
import { useCart } from '../context/CarrinhoContext';
import '/src/css/Pagamento.css'
import qrCodePix from '../assets/imagens/qrcodepix.jpg';
import {ToastContainer, toast} from 'react-toastify';
import { useCart } from '../context/CarrinhoContext';



function validaCPF(cpf) {

  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/[^\d]/g, ''); 
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false; 
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


// Formulário base para nome do cliente
const NomeClienteForm = ({ nomeCliente, setNomeCliente, error }) => (
  <div className="form-group">
    <label htmlFor="nomeCliente">Nome do Cliente</label>
    <input
      className={`input ${error ? 'error' : ''}`}
      type="text"
      id="nomeCliente"
      name="nomeCliente"
      value={nomeCliente}
      onChange={e => setNomeCliente(e.target.value)}
      placeholder="Digite seu nome para o pedido"
      required
    />
    {error && <p className="error-message">{error}</p>}
  </div>
);

const FormularioPix = ({ onSubmit, errors, nomeCliente, setNomeCliente }) => (
  <form onSubmit={onSubmit} noValidate>
    <NomeClienteForm nomeCliente={nomeCliente} setNomeCliente={setNomeCliente} error={errors.nomeCliente} />
    <div className="form-group">
      <label htmlFor="cpf">CPF</label>
      <input className={`input ${errors.cpf ? 'error' : ''}`} type="text" id="cpf" name="cpf" placeholder="000.000.000-00" />
      {errors.cpf && <p className="error-message">{errors.cpf}</p>}
    </div>
    <button type="submit" className="submit-button">Gerar QR Code</button>
  </form>
);

const FormularioCartao = ({ onSubmit, errors, nomeCliente, setNomeCliente }) => (
  <form onSubmit={onSubmit} noValidate>
    <NomeClienteForm nomeCliente={nomeCliente} setNomeCliente={setNomeCliente} error={errors.nomeCliente} />
    <div className="form-group">
      <label htmlFor="numeroCartao">Número do Cartão</label>
      <input className={`input ${errors.numeroCartao ? 'error' : ''}`} type="text" id="numeroCartao" name="numeroCartao" placeholder="0000 0000 0000 0000" maxLength="19" />
      {errors.numeroCartao && <p className="error-message">{errors.numeroCartao}</p>}
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

export default function Pagamento() {
  const { cartItems, infoEntrega, setCartItems } = useCart();
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [errors, setErrors] = useState({}); 
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const { cartItems, infoEntrega, setInfoEntrega } = useCart();


  const validate = (formData) => {
    const newErrors = {};
    if (!nomeCliente || nomeCliente.trim().length < 2) {
      newErrors.nomeCliente = 'O nome do cliente é obrigatório.';
    }
    if (metodoPagamento === 'pix') {
      if (!formData.cpf) newErrors.cpf = 'O CPF é obrigatório.';
      else if (!validaCPF(formData.cpf)) newErrors.cpf = 'CPF inválido.';
    }
    if (metodoPagamento === 'cartao') {
      const numeroCartaoLimpo = formData.numeroCartao.replace(/\s/g, '');
      if (!numeroCartaoLimpo) newErrors.numeroCartao = 'O número do cartão é obrigatório.';
      else if (!/^\d+$/.test(numeroCartaoLimpo)) newErrors.numeroCartao = 'O número do cartão deve conter apenas dígitos.';
      else if (numeroCartaoLimpo.length < 13 || numeroCartaoLimpo.length > 19) newErrors.numeroCartao = 'O número do cartão deve ter entre 13 e 19 dígitos.';
      if (!formData.validade) newErrors.validade = 'A data de validade é obrigatória.';
      else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.validade)) newErrors.validade = 'Formato inválido. Use MM/AA.';
      if (!formData.cvv) newErrors.cvv = 'O CVV é obrigatório.';
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'O CVV deve ter 3 ou 4 dígitos.';
    }
    return newErrors;
  };


  const [nomeCliente, setNomeCliente] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); 

    const formData = Object.fromEntries(new FormData(e.target).entries());
    const validationErrors = validate(formData);
  // nomeCliente já está no state

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setQrCodeVisible(false); 
      return;
    }

    if (metodoPagamento === 'pix') {
      console.log('Dados PIX validados:', formData);
      toast('Validação OK! Gerando PIX...');
      setQrCodeVisible(true);
      await enviarPedido(nomeCliente);
    } else {
      console.log('Dados do Cartão validados:', formData);
      toast('Validação OK! Processando pagamento...');
      setQrCodeVisible(false);
      await enviarPedido(nomeCliente);
    }
  };

  // Função para enviar pedido para o backend
  async function enviarPedido(nome) {
    if (!cartItems || cartItems.length === 0) return;
    const total = cartItems.reduce((sum, item) => sum + Number(item.preco) * (item.quantidade || 1), 0);
    const pedido = {
      itens: cartItems,
      infoEntrega,
      nomeCliente: nome || nomeCliente,
      total,
      status: 'pendente',
      data: new Date().toISOString()
    };
    try {
      const resp = await fetch('http://localhost:5000/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });
      if (resp.ok) {
        toast('Pedido enviado para a cozinha!');
        // Limpa infoEntrega e carrinho se desejar (exemplo: setInfoEntrega(''))
      } else {
        toast.error('Erro ao enviar pedido para a cozinha!');
      }
    } catch (err) {
      toast.error('Erro ao conectar com o backend!');
    }

    const novoPedido = {
      cliente: formData.nomeCompleto,
      entrega: infoEntrega,
      itens: cartItems,
      status: "preparando"
    };

    fetch("http://localhost:5000/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPedido)
      })
      .then(res => res.json())
      .then(() => {
        toast("Pedido registrado com sucesso!");
        setCartItems([]); // limpa carrinho
      })
      .catch(err => console.error("Erro ao registrar pedido:", err));

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
            <FormularioPix onSubmit={handleSubmit} errors={errors} nomeCliente={nomeCliente} setNomeCliente={setNomeCliente} />
            {qrCodeVisible && (
              <div className="qr-code-box">
                <p>Escaneie o QR Code para pagar com Pix:</p>
                <img
                  src={qrCodePix}
                  alt="QR Code Pix"
                  className="qr-code-image"
                />
                <p className="pix-copy-code">Chave Pix: 00020126360014br.gov.bcb.pix0114+55929915662525204000053039865802BR5925EMANUEL AMI DA SILVA HERN6009Sao Paulo62290525REC6881AD3B136E89665970116304A6BF</p>
              </div>
            )}
          </>
        ) : (
          <FormularioCartao onSubmit={handleSubmit} errors={errors} nomeCliente={nomeCliente} setNomeCliente={setNomeCliente} />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}