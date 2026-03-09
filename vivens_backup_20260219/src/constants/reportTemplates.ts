
import { ComplianceItem } from "@/types/report";

export const RN57_TEMPLATE_ITEMS: Omit<ComplianceItem, 'id'>[] = [
    // Ambientes Físicos
    { isHeader: true, itemNumber: "", description: "Ambientes Físicos da Instalação Animal", classification: "", status: "Não se aplica" },
    { itemNumber: "1", description: "Biotérios de criação de animais, que realizam a reprodução de animais, separados de biotérios com outras finalidades.", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "2", description: "Em edificação que abrigue biotérios de diferentes finalidades (criação, manutenção e utilização), as instalações de criação devem ter suas áreas físicas e rotinas com barreiras exclusivas, delimitadas e separadas dos biotérios de manutenção e de utilização", classification: "Obrigatório", status: "Não Verificado" },

    // Áreas de Apoio
    { isHeader: true, itemNumber: "", description: "Áreas de Apoio", classification: "", status: "Não se aplica" },
    { itemNumber: "3", description: "Área administrativa", classification: "Recomendado", status: "Não Verificado" },
    { itemNumber: "4", description: "Área de recepção de pessoal (usuários e visitantes)", classification: "Recomendado", status: "Não Verificado" },
    { itemNumber: "5", description: "No biotério de criação, o ingresso de animais deve ocorrer por meio da área de recepção de animais e quarentena", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "6", description: "No biotério de manutenção ou experimentação, o ingresso de animais deve ocorrer por meio de recepção em área de quarentena, exceto com relação aos animais com estado sanitário conhecido e compatível com o biotério de manutenção ou de experimentação de destino, que poderão ser introduzidos diretamente na sala de animais", classification: "Obrigatório", status: "Não Verificado" },

    // Áreas de Serviço
    { isHeader: true, itemNumber: "", description: "Áreas de Serviço", classification: "", status: "Não se aplica" },
    { itemNumber: "7", description: "Área destinada à higienização (lavagem, desinfecção ou esterilização de materiais) separada fisicamente da área de salas de animais", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "8", description: "Sanitários localizados fora das áreas controladas em biotérios de criação", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "9", description: "Salas de animais separadas por espécie", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "10", description: "Vestiário", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "11", description: "Sala destinada a eutanásia, separada das salas de animais, em biotérios de criação e manutenção", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "12", description: "Sala destinada a eutanásia, separada das salas de procedimentos, em biotérios de experimentação", classification: "Recomendado", status: "Não Verificado" },

    // Depósitos
    { isHeader: true, itemNumber: "", description: "Depósitos", classification: "", status: "Não se aplica" },
    { itemNumber: "13", description: "Local para estocagem de alimentos e forração que atendam às recomendações dos fabricantes", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "14", description: "Alimentos e forração sem contato com o piso ou paredes", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "15", description: "Área exclusiva para depósitos de resíduos", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "16", description: "Local para armazenamento de produtos químicos e medicamentos", classification: "Recomendado", status: "Não Verificado" },
    { itemNumber: "17", description: "Freezer para acondicionamento de carcaças", classification: "Obrigatório", status: "Não Verificado" },

    // Detalhes Construtivos
    { isHeader: true, itemNumber: "", description: "Detalhes Construtivos", classification: "", status: "Não se aplica" },
    { itemNumber: "18", description: "Paredes, pisos e tetos lisos, livres de rejuntes e reentrâncias, construídos com materiais que possibilitem higienização e desinfecção", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "19", description: "Ausência de janelas com acesso direto para as salas de animais de laboratório", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "20", description: "Grupo gerador próprio para fornecimento emergencial de energia elétrica", classification: "Recomendado", status: "Não Verificado" },
    { itemNumber: "21", description: "Sistema de monitoramento remoto da ambiência das salas dos animais, na ausência de grupo gerador próprio", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "22", description: "Sistema de iluminação com fotoperíodo regulável nas áreas controladas e salas de animais", classification: "Obrigatório", status: "Não Verificado" },

    // Ambiente
    { isHeader: true, itemNumber: "", description: "Ambiente", classification: "", status: "Não se aplica" },
    { itemNumber: "23", description: "Salas de animais com ventilação, exaustão temperatura e umidade controladas, conforme as características das espécies mantidas no recinto", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "24", description: "Monitoramento com registro das condições ambientais das salas de animais", classification: "Obrigatório", status: "Não Verificado" },

    // Biossegurança
    { isHeader: true, itemNumber: "", description: "Biossegurança", classification: "", status: "Não se aplica" },
    { itemNumber: "25", description: "Uso de equipamentos de proteção individual preconizados pelo nível de biossegurança da instalação", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "26", description: "Barreiras sanitárias de bioexclusão e biocontenção preconizadas pelo nível de biossegurança da instalação", classification: "Obrigatório", status: "Não Verificado" },

    // Procedimentos
    { isHeader: true, itemNumber: "", description: "Procedimentos", classification: "", status: "Não se aplica" },
    { itemNumber: "27", description: "Manual de Procedimentos Operacionais Padrão (POPs) em biotérios de criação", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "28", description: "Controle genético e sanitário", classification: "Recomendado", status: "Não Verificado" },
    { itemNumber: "29", description: "Alojamento em pares ou grupos, exceto em casos autorizados pela CEUA ou em virtude de condições clínicas", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "30", description: "Procedimentos experimentais não podem ser realizados na sala de manutenção e criação de animais", classification: "Obrigatório", status: "Não Verificado" },
    { itemNumber: "31", description: "Enriquecimento Ambiental", classification: "Obrigatório", status: "Não Verificado" },
];
