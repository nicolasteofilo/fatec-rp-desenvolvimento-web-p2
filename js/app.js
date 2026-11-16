
// [R1] Dados do catálogo
const instrumentos = [
  { id: 1, nome: 'Violão Acústico', categoria: 'Cordas', descricao: 'Violão acústico de madeira com excelente qualidade sonora.', preco: 599.90, disponivel: true },
  { id: 2, nome: 'Guitarra Elétrica', categoria: 'Cordas', descricao: 'Guitarra elétrica ideal para rock e outros estilos musicais.', preco: 1299.90, disponivel: true },
  { id: 3, nome: 'Teclado Musical', categoria: 'Teclas', descricao: 'Teclado musical com diversas funções e sons.', preco: 899.90, disponivel: true },
  { id: 4, nome: 'Piano Digital', categoria: 'Teclas', descricao: 'Piano digital com teclas sensíveis ao toque.', preco: 2499.90, disponivel: true },
  { id: 5, nome: 'Bateria Acústica', categoria: 'Percussão', descricao: 'Bateria acústica completa para apresentações e ensaios.', preco: 1899.90, disponivel: true },
  { id: 6, nome: 'Cajón', categoria: 'Percussão', descricao: 'Instrumento de percussão compacto feito de madeira.', preco: 349.90, disponivel: true },
  { id: 7, nome: 'Violino', categoria: 'Cordas', descricao: 'Violino com acabamento refinado e ótimo som.', preco: 799.90, disponivel: true },
  { id: 8, nome: 'Flauta Transversal', categoria: 'Sopro', descricao: 'Flauta transversal indicada para estudantes e músicos.', preco: 699.90, disponivel: true }
];

const catalogo = {
  nome: 'Minha Loja de Instrumentos Musicais',
  itens: instrumentos,

  proximoId: function () {
    let maiorId = 0;

    for (let i = 0; i < this.itens.length; i++) {
      if (this.itens[i].id > maiorId) {
        maiorId = this.itens[i].id;
      }
    }

    return maiorId + 1;
  },

  adicionar: function (item) {
    item.id = this.proximoId();
    this.itens.push(item);
  }
};


// Elementos da página
const campoPesquisa = document.getElementById('campo-pesquisa');
const filtroCategoria = document.getElementById('filtro-categoria');
const container = document.getElementById('lista-produtos');
const formCadastro = document.getElementById('form-cadastro');
const campoNome = document.getElementById('campo-nome');
const campoPreco = document.getElementById('campo-preco');
const campoCategoria = document.getElementById('campo-categoria');
const campoDescricao = document.getElementById('campo-descricao');
const mensagemForm = document.getElementById('mensagem-form');

// Novos elementos
const ordenacao = document.getElementById('ordenacao');
const botaoTema = document.getElementById('botao-tema');
const contadorDescricao = document.getElementById('contador-descricao');

// Lista atualmente exibida
let listaAtual = catalogo.itens;


// [R2] Renderização dinâmica
function classeDaCategoria(categoria) {
  switch (categoria) {
    case 'Cordas':
      return 'cat-cordas';
    case 'Teclas':
      return 'cat-teclas';
    case 'Percussão':
      return 'cat-percussao';
    case 'Sopro':
      return 'cat-sopro';
    default:
      return 'cat-outras';
  }
}

function formatarPreco(valor) {
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

function truncarDescricao(texto) {
  if (texto.length > 60) {
    return texto.slice(0, 60) + '…';
  }

  return texto;
}

// [R5] Atualiza o visual do card e o texto do botão conforme o estado
function aplicarEstado(card, botao, instrumento) {
  card.classList.toggle('indisponivel', !instrumento.disponivel);
  botao.textContent = instrumento.disponivel ? 'Disponível' : 'Indisponível';
}

function criarCard(instrumento) {
  const card = document.createElement('div');
  card.classList.add('card-produto');

  const nome = document.createElement('h3');
  nome.textContent = instrumento.nome;

  const categoria = document.createElement('p');
  categoria.classList.add('categoria', classeDaCategoria(instrumento.categoria));
  categoria.textContent = instrumento.categoria;

  const preco = document.createElement('p');
  preco.classList.add('preco');
  preco.textContent = formatarPreco(instrumento.preco);

  const descricao = document.createElement('p');
  descricao.classList.add('descricao');
  descricao.textContent = truncarDescricao(instrumento.descricao);

  // [R5] Botão que alterna a disponibilidade
  const botao = document.createElement('button');
  botao.type = 'button';
  aplicarEstado(card, botao, instrumento);

  botao.addEventListener('click', function () {
    instrumento.disponivel = !instrumento.disponivel;
    aplicarEstado(card, botao, instrumento);
    atualizarPainel(listaAtual);
  });

  // desafio: botão para remover o instrumento
  const botaoRemover = document.createElement('button');
  botaoRemover.type = 'button';
  botaoRemover.textContent = 'Remover';
  botaoRemover.classList.add('botao-remover');

  botaoRemover.addEventListener('click', function () {
    if (confirm('Deseja realmente remover este instrumento?')) {
      const indice = catalogo.itens.indexOf(instrumento);
      catalogo.itens.splice(indice, 1);

      filtrarInstrumentos();
    }
    
  });

  card.appendChild(nome);
  card.appendChild(categoria);
  card.appendChild(preco);
  card.appendChild(descricao);
  card.appendChild(botao);
  card.appendChild(botaoRemover);

  return card;
}

function renderizar(lista) {
  container.innerHTML = '';

  if (lista.length === 0) {
    const mensagem = document.createElement('p');
    mensagem.textContent = 'Nenhum item encontrado';
    container.appendChild(mensagem);
    return;
  }

  lista.forEach(function (instrumento) {
    container.appendChild(criarCard(instrumento));
  });
}


// desafio: ordenação utilizando laços
function ordenarInstrumentos(lista) {
  const listaOrdenada = [];

  // Copia os instrumentos para uma nova lista
  for (let i = 0; i < lista.length; i++) {
    listaOrdenada.push(lista[i]);
  }

  // Ordenação pelo nome ou preço
  for (let i = 0; i < listaOrdenada.length; i++) {
    for (let j = 0; j < listaOrdenada.length - 1; j++) {

      let trocar = false;

      if (ordenacao.value === 'nome') {
        if (listaOrdenada[j].nome.toLowerCase() >
            listaOrdenada[j + 1].nome.toLowerCase()) {
          trocar = true;
        }
      }

      if (ordenacao.value === 'preco') {
        if (listaOrdenada[j].preco > listaOrdenada[j + 1].preco) {
          trocar = true;
        }
      }

      if (trocar) {
        const auxiliar = listaOrdenada[j];
        listaOrdenada[j] = listaOrdenada[j + 1];
        listaOrdenada[j + 1] = auxiliar;
      }
    }
  }

  return listaOrdenada;
}


// [R3] Busca e filtro por categoria
function filtrarInstrumentos() {
  const textoBusca = campoPesquisa.value.toLowerCase();
  const categoriaSelecionada = filtroCategoria.value;
  const listaFiltrada = [];

  for (let i = 0; i < catalogo.itens.length; i++) {
    const instrumento = catalogo.itens[i];
    const correspondeNome = instrumento.nome.toLowerCase().indexOf(textoBusca) !== -1;
    const correspondeCategoria =
      categoriaSelecionada === 'Todas' || instrumento.categoria === categoriaSelecionada;

    if (correspondeNome && correspondeCategoria) {
      listaFiltrada.push(instrumento);
    }
  }

  // Aplica a ordenação na lista filtrada
  listaAtual = ordenarInstrumentos(listaFiltrada);

  renderizar(listaAtual);
  atualizarPainel(listaAtual);
}

campoPesquisa.addEventListener('input', filtrarInstrumentos);
filtroCategoria.addEventListener('change', filtrarInstrumentos);

// Atualiza a lista quando mudar a ordenação
ordenacao.addEventListener('change', filtrarInstrumentos);

campoPesquisa.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    campoPesquisa.value = '';
    filtroCategoria.value = 'Todas';
    filtrarInstrumentos();
  }
});


// desafio: modo escuro
botaoTema.addEventListener('click', function () {
  document.body.classList.toggle('modo-escuro');
});


// desafio: contador de caracteres
campoDescricao.addEventListener('input', function () {
  contadorDescricao.textContent = campoDescricao.value.length + ' caracteres';
});


// [R6] Painel de estatísticas
function atualizarPainel(lista) {
  const total = document.getElementById('painel-total');
  const disponiveis = document.getElementById('painel-disponiveis');
  const media = document.getElementById('painel-media');
  const maior = document.getElementById('painel-maior');

  if (lista.length === 0) {
    total.textContent = '0';
    disponiveis.textContent = '—';
    media.textContent = '—';
    maior.textContent = '—';

    return;
  }

  let qtdDisponiveis = 0;
  let soma = 0;
  let maisCaro = lista[0];

  for (let i = 0; i < lista.length; i++) {
    if (lista[i].disponivel) {
      qtdDisponiveis++;
    }
    soma += lista[i].preco;
    if (lista[i].preco > maisCaro.preco) {
      maisCaro = lista[i];
    }
  }

  total.textContent = lista.length;
  disponiveis.textContent = qtdDisponiveis;
  media.textContent = formatarPreco(soma / lista.length);
  maior.textContent = maisCaro.nome + ' (' + formatarPreco(maisCaro.preco) + ')';
}


// [R4] Cadastro com validação
function criarErro(mensagem, campo) {
  const erro = new Error(mensagem);
  erro.campo = campo;
  return erro;
}

function validar(dados) {
  if (dados.nome.length < 3) {
    throw criarErro('O nome deve ter no mínimo 3 caracteres.', campoNome);
  }

  if (isNaN(dados.preco) || dados.preco <= 0 || dados.preco > 50000) {
    throw criarErro('Informe um preço maior que 0 e até 50000.', campoPreco);
  }

  if (dados.categoria === '') {
    throw criarErro('Selecione uma categoria.', campoCategoria);
  }
}

function limparErros() {
  [campoNome, campoPreco, campoCategoria].forEach(function (campo) {
    campo.classList.remove('erro');
  });
}

function exibirMensagem(texto, tipo) {
  mensagemForm.textContent = texto;
  mensagemForm.classList.remove('erro', 'sucesso');
  mensagemForm.classList.add(tipo);
}

formCadastro.addEventListener('submit', function (event) {
  event.preventDefault();
  limparErros();

  const dados = {
    nome: campoNome.value.trim(),
    preco: parseFloat(campoPreco.value.replace(',', '.')),
    categoria: campoCategoria.value,
    descricao: campoDescricao.value.trim()
  };

  try {
    validar(dados);

    catalogo.adicionar({
      nome: dados.nome,
      categoria: dados.categoria,
      descricao: dados.descricao,
      preco: dados.preco,
      disponivel: true
    });

    formCadastro.reset();

    // Reinicia o contador após cadastrar
    contadorDescricao.textContent = '0 caracteres';

    exibirMensagem('Instrumento cadastrado com sucesso.', 'sucesso');
    filtrarInstrumentos();
  } catch (erro) {
    if (erro.campo) {
      erro.campo.classList.add('erro');
    }
    exibirMensagem(erro.message, 'erro');
  }
});

// Remove o erro do campo assim que o usuário corrige
[campoNome, campoPreco, campoCategoria].forEach(function (campo) {
  campo.addEventListener('input', function () {
    campo.classList.remove('erro');
  });
});


// [R7] Exibição inicial
filtrarInstrumentos();
