import { User, Session } from "@supabase/supabase-js";

// VITE_API_URL deve apontar para onde a pasta /api/ está hospedada no HostGator
const API_URL = import.meta.env.VITE_API_URL || 'https://mail.vivenslab.com/api';

const base64Url = (str: string) => {
    return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const arrayBufferToBase64Url = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return base64Url(binary);
};

const createJWT = async (email: string) => {
    const header = base64Url(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
    const payload = base64Url(JSON.stringify({
        id: 'usr_' + email.replace(/[^a-z0-9]/g, '_'),
        email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365)
    }));
    const secret = 'vivens_super_secret_key_2026';
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, enc.encode(`${header}.${payload}`));
    return `${header}.${payload}.${arrayBufferToBase64Url(signature)}`;
};

const getHeaders = () => {
    const sessionStr = localStorage.getItem('vivens_session');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            if (session.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }
        } catch (e) {
            // Ignore invalid JSON in localStorage
        }
    }
    return headers;
};

// Mock Auth
const auth = {
    async signInWithPassword({ email, password }: any) {
        const cleanEmail = (email || '').toLowerCase().trim();
        const allowedUsers: Record<string, string> = {
            'bruno@vivenslab.com': 'Bruno123',
            'jivago@vivenslab.com': 'Lara2013!',
            'luisa@vivenslab.com': 'luisa123'
        };

        if (cleanEmail && allowedUsers[cleanEmail] === password) {
            let token = 'session_token_' + Math.random().toString(36).substring(2);
            try {
                token = await createJWT(cleanEmail);
            } catch (e) {
                // Fallback
            }

            const mockSession = {
                access_token: token,
                user: {
                    id: 'usr_' + cleanEmail.replace(/[^a-z0-9]/g, '_'),
                    email: cleanEmail
                }
            };
            localStorage.setItem('vivens_session', JSON.stringify(mockSession));
            window.dispatchEvent(new Event('authChange'));
            return { data: { session: mockSession, user: mockSession.user }, error: null };
        }

        try {
            const res = await fetch(`${API_URL}/auth.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && data.session) {
                localStorage.setItem('vivens_session', JSON.stringify(data.session));
                window.dispatchEvent(new Event('authChange'));
                return { data, error: null };
            }
        } catch (error: any) {
            // Silently fallback
        }

        return { data: { session: null, user: null }, error: new Error('Credenciais de login inválidas') };
    },
    async signOut() {
        localStorage.removeItem('vivens_session');
        window.dispatchEvent(new Event('authChange'));
        return { error: null };
    },
    async getSession() {
        const sessionStr = localStorage.getItem('vivens_session');
        if (sessionStr) {
            try {
                return { data: { session: JSON.parse(sessionStr) } };
            } catch (e) {
                return { data: { session: null } };
            }
        }
        return { data: { session: null } };
    },
    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        // Run immediately once
        this.getSession().then(({ data }) => {
            callback('INITIAL_SESSION', data.session as any);
        });

        const listener = () => {
            this.getSession().then(({ data }) => {
                callback('SIGNED_IN', data.session as any);
            });
        };
        window.addEventListener('authChange', listener);

        return {
            data: {
                subscription: {
                    unsubscribe: () => {
                        window.removeEventListener('authChange', listener);
                    }
                }
            }
        };
    }
};

const INITIAL_SEEDS: Record<string, any[]> = {
    clients: [
        {
            id: "a0915a19-fa78-41f1-96a7-c91f09ff93a9",
            name: "FUNDACAO EDUCACIONAL DE CRICIUMA",
            fantasy_name: "UNIVERSIDADE DO EXTREMO SUL CATARINENSE - UNESC",
            email: "",
            phone: "004804312500",
            document: "83.661.074/0001-04",
            address: "UNIVERSITARIA, 1105 - UNIVERSITARIO, CRICIUMA/SC",
            created_at: "2026-01-21T23:16:35.725864+00:00"
        },
        {
            id: "532e291e-9463-4ef5-8066-f97e5970b2ec",
            name: "FUNDACAO PARA O DESENVOLVIMENTO MEDICO E HOSPITALAR",
            fantasy_name: "FUNDACAO PARA O DESENVOLVIMENTO MEDICO E HOSPITALAR",
            email: "diretoria@famesp.org.br",
            phone: "1438814800",
            document: "46230439000101",
            address: "JOAO BUTIGNOLI, S/N - RUBIAO JUNIOR, BOTUCATU/SP",
            created_at: "2026-01-21T23:19:12.090345+00:00"
        },
        {
            id: "b10t3c-8102-4c22-990a-biotec000001",
            name: "GRUPO BIOTEC",
            fantasy_name: "GRUPO BIOTEC",
            email: "contato@grupobiotec.com.br",
            phone: "",
            document: "",
            address: "https://www.grupobiotec.com.br/",
            created_at: "2026-08-06T12:00:00.000000+00:00"
        },
        {
            id: "ct-vacinas-client-001",
            name: "CT VACINAS",
            fantasy_name: "CT VACINAS",
            email: "contato@ctvacinas.org.br",
            phone: "",
            document: "",
            address: "BELO HORIZONTE/MG",
            created_at: "2026-08-03T12:00:00.000000+00:00"
        },
        {
            id: "ufmg-client-002",
            name: "UNIVERSIDADE FEDERAL DE MINAS GERAIS",
            fantasy_name: "UNIVERSIDADE FEDERAL DE MINAS GERAIS",
            email: "contato@ufmg.br",
            phone: "",
            document: "",
            address: "BELO HORIZONTE/MG",
            created_at: "2026-08-04T12:00:00.000000+00:00"
        }
    ],
    projects: [
        {
            id: "8ba4d040-970e-422c-9b28-d2789f529b3a",
            client_id: "a0915a19-fa78-41f1-96a7-c91f09ff93a9",
            title: "Consultoria 01",
            status: "completed",
            start_date: "2026-01-21",
            created_at: "2026-01-21T23:21:05.774592+00:00",
            clients: { name: "FUNDACAO EDUCACIONAL DE CRICIUMA" }
        },
        {
            id: "d4f5a8e1-1f50-46d4-894e-d44fdd29463e",
            client_id: "532e291e-9463-4ef5-8066-f97e5970b2ec",
            title: "Consultoria 02",
            status: "active",
            start_date: "2026-01-21",
            created_at: "2026-01-21T23:21:05.774592+00:00",
            clients: { name: "FUNDACAO PARA O DESENVOLVIMENTO MEDICO E HOSPITALAR" }
        },
        {
            id: "ct-vacinas-project-001",
            client_id: "ct-vacinas-client-001",
            title: "CT Vacinas",
            status: "active",
            start_date: "2026-08-03",
            created_at: "2026-08-03T12:00:00.000000+00:00",
            clients: { name: "CT VACINAS" }
        }
    ],
    reports: [
        {
            id: "989b7a2e-9a4a-437e-83d1-50f8312e0090",
            project_id: "d4f5a8e1-1f50-46d4-894e-d44fdd29463e",
            title: "UNIDADE DE PESQUISA EXPERIMENTAL-UNIPEX UNESP-BOTUCATU UPEA 1",
            type: "Consultoria",
            content: [
                        {
                                "id": "4dc2661f-36ec-4bb2-a74b-30241ee0082d",
                                "data": {
                                        "text": "1. Não Conformidades Críticas – Ação Imediata\nRepresentam falhas graves que comprometem diretamente a segurança, a conformidade regulatória ou o bem-estar animal.\nExigem ação corretiva imediata, podendo inclusive demandar a suspensão de atividades até a resolução.\nBaseado na RN57 do CONCEA a classificação é OBRIGATÓRIA e o status NÃO ATENDE. \n2. Não Conformidades de Alta Prioridade\nSão falhas significativas que não causam impacto imediato crítico, mas que podem evoluir para situações de risco ou comprometer auditorias/acreditações.\nExigem correção em curto prazo. \nBaseado na RN57 do CONCEA a classificação é OBRIGATÓRIA e o status ATENDE EM PARTES. \n3. Não Conformidades de Prioridade Média\nSão falhas de impacto moderado, que não comprometem imediatamente a conformidade ou a segurança, mas indicam necessidade de ajustes.\nExigem ação corretiva planejada, podendo ser tratadas em médio prazo. \nBaseado na RN57 do CONCEA a classificação é RECOMENDADA e o status NÃO ATENDE. \n",
                                        "title": "SUMARIO PARA A CLASSIFICAÇÃO DAS NÃO CONFORMIDADES"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "c664645e-aac1-4caa-8bbd-0a429f296af2",
                                "data": {
                                        "title": "Ambientes Físicos da Instalação Animal"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "a004274d-7584-4aaf-b07f-fe15514becc0",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Não se aplica",
                                                        "itemNumber": "1",
                                                        "description": "Biotérios de criação de animais, que realizam a reprodução de animais, separados de biotérios com outras finalidades.\nEm edificação que abrigue biotérios de diferentes finalidades (criação, manutenção e utilização), as instalações de criação devem ter suas áreas físicas e rotinas com barreiras exclusivas, delimitadas e separadas dos biotérios de manutenção e de utilização\n",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Ambientes Físicos da Instalação Animal"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "953ff2f2-e614-4080-a56e-5f2d78d09a77",
                                "data": {
                                        "title": "Áreas de Apoio"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "e540382d-1b58-40c5-b63d-61a49550c179",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Não Atende",
                                                        "itemNumber": "2",
                                                        "description": "Área administrativa",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "3",
                                                        "description": "Área de recepção de pessoal (usuários e visitantes)",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "status": "Não se aplica",
                                                        "itemNumber": "4",
                                                        "description": "No biotério de criação, o ingresso de animais deve ocorrer por meio da área de recepção de animais e quarentena",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "5",
                                                        "description": "No biotério de manutenção ou experimentação, o ingresso de animais deve ocorrer por meio de recepção em área de quarentena, exceto com relação aos animais com estado sanitário conhecido e compatível com o biotério de manutenção ou de experimentação de destino, que poderão ser introduzidos diretamente na sala de animais",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Áreas de Apoio"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "43447052-8730-45b4-b4c3-f4358ed750e6",
                                "data": {
                                        "title": "Áreas de Serviço"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "4c933ca2-418b-4abc-8479-33b17c48d416",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "6",
                                                        "description": "Área destinada à higienização (lavagem, desinfecção ou esterilização de materiais) separada fisicamente da área de salas de animais",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "7",
                                                        "description": "Sanitários localizados fora das áreas controladas em biotérios de criação",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "8",
                                                        "description": "Salas de animais separadas por espécie",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "9",
                                                        "description": "Vestiário",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "10",
                                                        "description": "Sala destinada à eutanásia, separada das salas de animais, em biotérios de criação e manutenção",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "11",
                                                        "description": "Sala destinada a eutanásia, separada das salas de manutenção de animais, em biotérios de experimentação",
                                                        "classification": "Recomendado"
                                                }
                                        ],
                                        "title": ""
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "3c91be1d-d287-499a-b5b9-ff282c5f5878",
                                "data": {
                                        "title": "Depósitos"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "6f4547a6-973f-4873-bef0-a93786df5ae7",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "12",
                                                        "description": "Local para estocagem de alimentos e forração que atendam às recomendações dos fabricantes",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "13",
                                                        "description": "Alimentos e forração sem contato com o piso ou paredes",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "14",
                                                        "description": "Área exclusiva para depósitos de resíduos",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "15",
                                                        "description": "Local para armazenamento de produtos químicos e medicamentos",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "16",
                                                        "description": "Freezer para acondicionamento de carcaças",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Depósitos"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "f8ba706a-d507-44f2-9b21-9f4e1edcabd4",
                                "data": {
                                        "title": "Detalhes Construtivos"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "4b5a7170-8141-45e7-b4e5-337ea8bcd995",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "17",
                                                        "description": "Paredes, pisos e tetos lisos, livres de rejuntes e reentrâncias, construídos com materiais que possibilitem higienização e desinfecção",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "18",
                                                        "description": "Ausência de janelas com acesso direto para as salas de animais de laboratório",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "19",
                                                        "description": "Grupo gerador próprio para fornecimento emergencial de energia elétrica",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "status": "Não Atende",
                                                        "itemNumber": "20",
                                                        "description": "Sistema de monitoramento remoto da ambiência das salas dos animais, na ausência de grupo gerador próprio",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "21",
                                                        "description": "Sistema de iluminação com fotoperíodo regulável nas áreas controladas e salas de animais",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Detalhes Construtivos"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "0b9a7a3a-4076-42ac-bab2-76f80e5d3739",
                                "data": {
                                        "title": "Ambiente"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "8879b33b-d392-44ca-8565-c6d8c90cc7a2",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "22",
                                                        "description": "Salas de animais com ventilação, exaustão temperatura e umidade controladas, conforme as características das espécies mantidas no recinto",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não Atende",
                                                        "itemNumber": "23",
                                                        "description": "Monitoramento com registro das condições ambientais das salas de animais",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": ""
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "2c676a1d-2be9-474e-92bb-91310d8b7070",
                                "data": {
                                        "title": "Biossegurança"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "b940d247-5f51-4f0d-b967-5d5084891db7",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "24",
                                                        "description": "Uso de equipamentos de proteção individual preconizados pelo nível de biossegurança da instalação",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende em Partes",
                                                        "itemNumber": "25",
                                                        "description": "Barreiras sanitárias de bioexclusão e biocontenção preconizadas pelo nível de biossegurança da instalação",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": ""
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "9f971382-350e-4019-8665-ba7915825504",
                                "data": {
                                        "title": "Procedimentos"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "59baa4f8-d562-4be5-bfa4-597fbf44b5bc",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Não Verificado",
                                                        "itemNumber": "26",
                                                        "description": "Manual de Procedimentos Operacionais Padrão (POPs) em biotérios de criação",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não Verificado",
                                                        "itemNumber": "27",
                                                        "description": "Controle genético e sanitário",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "status": "Não Verificado",
                                                        "itemNumber": "28",
                                                        "description": "Alojamento em pares ou grupos, exceto em casos autorizados pela CEUA ou em virtude de condições clínicas",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não Atende",
                                                        "itemNumber": "29",
                                                        "description": "Procedimentos experimentais não podem ser realizados na sala de manutenção e criação de animais",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não Verificado",
                                                        "itemNumber": "30",
                                                        "description": "Enriquecimento Ambiental",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": ""
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "694086b0-1499-4418-9350-f4acf665be05",
                                "data": {
                                        "title": "NÃO‑conformidades críticas – ação imediata"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "5ab01fdf-62d7-4c48-8fc5-c4ef66fc23ce",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "20",
                                                        "description": "Sistema de monitoramento remoto ",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Detalhes Construtivos"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "cb59f8fb-8223-4083-954d-a10395071f10",
                                "data": {
                                        "text": "Na ausência do grupo gerador próprio, é preciso que esteja presente um sistema de monitoramento da ambiência nas salas. Isto não foi verificado",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "fc04f14d-420b-4119-a092-410553437f76",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "22",
                                                        "description": "Salas de animais com ventilação, exaustão temperatura e umidade controladas",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Ambiente"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "22a4b9f9-bcd2-41e3-b7d0-e1a3c39f3f72",
                                "data": {
                                        "text": "Embora a área experimental tenha a estrutura para o ar-condicionado central, verificamos que o mesmo precisa ser revisado ou que seja feita uma manutenção com urgência. A climatização dentro das salas é item obrigatório pela RN57, então consideramos o status crítico.",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "595c32de-e7ce-4a4f-b678-4d7e248a220d",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "23",
                                                        "description": "Monitoramento com registro das salas dos animais",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": ""
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "67019fbb-3ed4-4839-a8f0-88ec6ba0c60e",
                                "data": {
                                        "text": "Não foi verificado este registro. O mesmo deve ser executado, no mínimo duas vezes ao dia\n",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "6176bdbc-09e0-42e6-9c8e-6429b29e8195",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "25",
                                                        "description": "Barreiras sanitárias ",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Biossegurança"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "ea419fa9-825a-4cd5-8bce-f2a498fa6a42",
                                "data": {
                                        "text": "Os fluxos dentro do biotério precisam ser readequados. Também a manutenção de animais transgênicos, requer condições de nível NBA2. São correções críticas.",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "b0854388-aa2a-457c-89f7-31fc92fc6b34",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Procedimentos experimentais não podem ser realizados nas salas de manutenção de animais\n",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Procedimentos"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "8cf0ff4c-880e-4b1c-8999-ed297644b2ff",
                                "data": {
                                        "text": "Nenhum procedimento deve ser realizado nas salas de manutenção/alojamento onde os animais estão sendo alojados.",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "bcb5762b-a7f9-414d-95fd-b05c7d197b2d",
                                "data": {
                                        "title": "SUGESTÕES DE CORREÇÃO E MELHORIAS"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "34a15e49-4986-4216-9c80-54ba2a276720",
                                "data": {
                                        "text": "●\tO procedimento de monitorar as condições ambientais das salas (item 23) precisa ser efetivamente executado duas vezes ao dia, no mínimo.\n●\t As intervenções experimentais (item 29), incluindo pesagem, marcação, coletas ou quaisquer outras intercorrências, devem ocorrer obrigatoriamente nas salas de procedimentos (invasivos ou não invasivos), específicas para cada espécie. É vedado que qualquer animal presencie dor ou aflição em seus congêneres.\n\n",
                                        "title": "CRÍTICAS (AÇÃO IMEDIATA)"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "fc843090-da9e-4fdd-b226-6aeaf3514b92",
                                "data": {
                                        "text": "●\tA climatização é um item crucial em biotérios de roedores (item 22):  Embora tenhamos verificado que existe manutenção da ambiência na maioria das salas, a manutenção não vem ocorrendo de forma adequada. Este é um dos itens mais fundamental, já que afeta diretamente a saúde e o bem-estar dos animais.\n●\tOs fluxos de trabalho precisam ser revistos e para tanto precisamos das plantas, com legendas e uma reunião, por meeting, com o coordenador da instalação e o responsável técnico.\n",
                                        "title": "ALTA PRIORIDADE"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "2074f7f3-e6b1-4bb5-b25b-1d99f99a2918",
                                "data": {
                                        "title": "SUGESTÕES DE ADEQUAÇÕES ARQUITETÔNICAS PARA CONFORMIDADE RN 57"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "b256d5b7-9778-4124-ae6c-e208c4a3e3b0",
                                "data": {
                                        "text": "As sugestões de desenho arquitetônico, com o objetivo de atender integralmente às diretrizes estabelecidas na Resolução Normativa nº 57 do CONCEA, contemplando os fluxos de trabalho, áreas funcionais e requisitos mínimos necessários para garantir a conformidade regulatória e a adequada operação do biotério, dependem do recebimento da planta da instalação animal.",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "440a2977-dc7d-4fb7-b076-600b6050b55b",
                                "data": {
                                        "title": "CONSIDERAÇÕES FINAIS"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "2892f22f-3b99-4a09-83ea-de164919b8d5",
                                "data": {
                                        "text": "A consultoria realizada permitiu identificar de forma sistemática diversas não conformidades classificadas como críticas, de prioridade alta e média, que comprometem a conformidade com as normativas vigentes, bem como a segurança e o bem-estar dos animais e dos profissionais envolvidos. A análise evidenciou a necessidade de adequações estruturais e de fluxos internos para garantir a implementação das boas práticas de laboratório e atender aos requisitos estabelecidos pelos órgãos regulatórios.",
                                        "title": ""
                                },
                                "type": "text_section"
                        }
                ],
                "images": [],
                "status": "draft",
                "pdf_url": null,
                "created_at": "2026-01-21T23:22:25.921971+00:00",
                "updated_at": "2026-02-23T00:29:26.902+00:00",
                "projects": {
                        "title": "Consultoria 02",
                        "clients": {
                                "name": "FUNDACAO PARA O DESENVOLVIMENTO MEDICO E HOSPITALAR"
                        }
                }
        },
        {
                "id": "94c57c85-af5e-4644-ad5d-84cc9ec02030",
                "project_id": "d4f5a8e1-1f50-46d4-894e-d44fdd29463e",
                "title": "UNIDADE DE PESQUISA EXPERIMENTAL-UNIPEX UNESP-BOTUCATU  UPEA 4",
                "type": "Consultoria",
                "content": [
                        {
                                "id": "a41fb022-2bc0-4dde-ad07-12771f367b26",
                                "data": {
                                        "title": "1. RESUMO EXECUTIVO"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "33ba40e8-49a7-4930-9f0d-4114dbb77c65",
                                "data": {
                                        "generalStatus": "Múltiplas não‑conformidades críticas",
                                        "criticalImages": 7,
                                        "evaluationDate": "29/01/2026",
                                        "imagesAnalyzed": 125
                                },
                                "type": "executive_summary"
                        },
                        {
                                "id": "98e72d86-be78-411d-b655-f48e7f657908",
                                "data": {
                                        "text": "1. Não Conformidades Críticas – Ação Imediata\n●\tRepresentam falhas graves que comprometem diretamente a segurança, a conformidade regulatória ou o bem-estar animal.\n●\tExigem ação corretiva imediata, podendo inclusive demandar a suspensão de atividades até a resolução.\n●\tBaseado na RN57 do CONCEA a classificação é OBRIGATÓRIA e o status NÃO ATENDE. \n2. Não Conformidades de Alta Prioridade\n●\tSão falhas significativas que não causam impacto imediato crítico, mas que podem evoluir para situações de risco ou comprometer auditorias/acreditações.\n●\tExigem correção em curto prazo. \n●\tBaseado na RN57 do CONCEA a classificação é OBRIGATÓRIA e o status ATENDE EM PARTES. \n3. Não Conformidades de Prioridade Média\n●\tSão falhas de impacto moderado, que não comprometem imediatamente a conformidade ou a segurança, mas indicam necessidade de ajustes.\n●\tExigem ação corretiva planejada, podendo ser tratadas em médio prazo. \n●\tBaseado na RN57 do CONCEA a classificação é RECOMENDADA e o status NÃO ATENDE. \n.\n\n",
                                        "title": "SUMARIO PARA A CLASSIFICAÇÃO DAS NÃO CONFORMIDADES"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "49a40c54-11ed-4c8b-add7-aa97299800c8",
                                "data": {
                                        "title": "ANÁLISE DE CONFORMIDADES E NÃO-CONFORMIDADES EM RELAÇÃO A RESOLUÇÃO NORMATIVA 57/CONCEA  UPEA 4 Coelhos"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "e263d211-6977-485e-bbca-7fb06e7f194d",
                                "data": {
                                        "items": [
                                                {
                                                        "id": "ff14d53b-7f39-4125-9a33-f7013b93f886",
                                                        "status": "Não se aplica",
                                                        "isHeader": true,
                                                        "itemNumber": "",
                                                        "description": "Ambientes Físicos da Instalação Animal",
                                                        "classification": ""
                                                },
                                                {
                                                        "id": "e49ddaf2-a4cd-45e3-ab5e-ea7901f80993",
                                                        "status": "Não se aplica",
                                                        "itemNumber": "1",
                                                        "description": "Biotérios de criação de animais, que realizam a reprodução de animais, separados de biotérios com outras finalidades.",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "46354983-f91b-4712-8ad2-fab7e14e2a64",
                                                        "status": "Não se aplica",
                                                        "itemNumber": "2",
                                                        "description": "Em edificação que abrigue biotérios de diferentes finalidades (criação, manutenção e utilização), as instalações de criação devem ter suas áreas físicas e rotinas com barreiras exclusivas, delimitadas e separadas dos biotérios de manutenção e de utilização",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "36bd307e-99fc-4a7e-a9fc-1546ef2cb148",
                                                        "status": "Não se aplica",
                                                        "isHeader": true,
                                                        "itemNumber": "",
                                                        "description": "Áreas de Apoio",
                                                        "classification": ""
                                                },
                                                {
                                                        "id": "11551149-2c67-422c-9e6c-7709f2a1b428",
                                                        "status": "Não Atende",
                                                        "itemNumber": "3",
                                                        "description": "Área administrativa",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "id": "853882fe-3e72-46ee-b7bf-a44ab924df94",
                                                        "status": "Atende",
                                                        "itemNumber": "4",
                                                        "description": "Área de recepção de pessoal (usuários e visitantes)",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "id": "69db9e23-03eb-4f81-9b8f-dbbcd816b777",
                                                        "status": "Não se aplica",
                                                        "itemNumber": "5",
                                                        "description": "No biotério de criação, o ingresso de animais deve ocorrer por meio da área de recepção de animais e quarentena",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "6b75130a-0d93-40a6-b355-832491514860",
                                                        "status": "Atende",
                                                        "itemNumber": "6",
                                                        "description": "No biotério de manutenção ou experimentação, o ingresso de animais deve ocorrer por meio de recepção em área de quarentena, exceto com relação aos animais com estado sanitário conhecido e compatível com o biotério de manutenção ou de experimentação de destino, que poderão ser introduzidos diretamente na sala de animais",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "2e887f1a-66f2-4030-9b00-d224803d7396",
                                                        "status": "Não se aplica",
                                                        "isHeader": true,
                                                        "itemNumber": "",
                                                        "description": "Áreas de Serviço",
                                                        "classification": ""
                                                },
                                                {
                                                        "id": "d62d9e09-76d9-4e9b-aaf6-cc8e83c9e2b4",
                                                        "status": "Não Atende",
                                                        "itemNumber": "7",
                                                        "description": "Área destinada à higienização (lavagem, desinfecção ou esterilização de materiais) separada fisicamente da área de salas de animais",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "e06709fe-bde8-40f7-b7b4-286266b222b9",
                                                        "status": "Atende",
                                                        "itemNumber": "8",
                                                        "description": "Sanitários localizados fora das áreas controladas em biotérios de criação",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "899e7417-ca38-4231-aa85-877159d232e1",
                                                        "status": "Atende",
                                                        "itemNumber": "9",
                                                        "description": "Salas de animais separadas por espécie",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "f618241c-6490-4e6f-9fe0-d74190216b52",
                                                        "status": "Atende em Partes",
                                                        "itemNumber": "10",
                                                        "description": "Vestiário",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "2ec8c5be-733b-46f3-a5c1-d5e1c85a3266",
                                                        "status": "Não se aplica",
                                                        "itemNumber": "11",
                                                        "description": "Sala destinada a eutanásia, separada das salas de animais, em biotérios de criação e manutenção",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "ae1bc466-f8a2-49f0-b227-33ec993d0073",
                                                        "status": "Atende",
                                                        "itemNumber": "12",
                                                        "description": "Sala destinada a eutanásia, separada das salas de procedimentos, em biotérios de experimentação",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "id": "8eb37554-01f3-4310-9c21-1745abc7a46c",
                                                        "status": "Não se aplica",
                                                        "isHeader": true,
                                                        "itemNumber": "",
                                                        "description": "Depósitos",
                                                        "classification": ""
                                                },
                                                {
                                                        "id": "7615bae8-d638-46b6-bb49-8842e42f1f61",
                                                        "status": "Não Atende",
                                                        "itemNumber": "13",
                                                        "description": "Local para estocagem de alimentos e forração que atendam às recomendações dos fabricantes",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "5134c9a1-8880-451c-aa77-b6349112ab6e",
                                                        "status": "Não Atende",
                                                        "itemNumber": "14",
                                                        "description": "Alimentos e forração sem contato com o piso ou paredes",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "d0d76637-b9bf-4325-a9d5-29d899610ab5",
                                                        "status": "Não Atende",
                                                        "itemNumber": "15",
                                                        "description": "Área exclusiva para depósitos de resíduos",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "08412853-0fba-435a-9b0a-f0c8680eb583",
                                                        "status": "Não Atende",
                                                        "itemNumber": "16",
                                                        "description": "Local para armazenamento de produtos químicos e medicamentos",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "id": "b5865bb8-fd80-42c3-816b-0533fb70e23a",
                                                        "status": "Não Atende",
                                                        "itemNumber": "17",
                                                        "description": "Freezer para acondicionamento de carcaças",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "544021b0-5d80-4d58-8d05-41d9b2649908",
                                                        "status": "Não se aplica",
                                                        "isHeader": true,
                                                        "itemNumber": "",
                                                        "description": "Detalhes Construtivos",
                                                        "classification": ""
                                                },
                                                {
                                                        "id": "ac2decd5-d08e-4fb8-a395-6ddf623584a9",
                                                        "status": "Não Atende",
                                                        "itemNumber": "18",
                                                        "description": "Paredes, pisos e tetos lisos, livres de rejuntes e reentrâncias, construídos com materiais que possibilitem higienização e desinfecção",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "d4f1ded3-3739-489b-afc9-0125647cd41c",
                                                        "status": "Atende",
                                                        "itemNumber": "19",
                                                        "description": "Ausência de janelas com acesso direto para as salas de animais de laboratório",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "5d55c82d-9c0d-434f-833a-3dd4a88d46d0",
                                                        "status": "Atende",
                                                        "itemNumber": "20",
                                                        "description": "Grupo gerador próprio para fornecimento emergencial de energia elétrica",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "id": "95449cdd-a720-48b8-aa79-1119a1655c23",
                                                        "status": "Não Atende",
                                                        "itemNumber": "21",
                                                        "description": "Sistema de monitoramento remoto da ambiência das salas dos animais, na ausência de grupo gerador próprio",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "9a74fae8-a12a-4566-96f7-0ef754ee5e0d",
                                                        "status": "Atende",
                                                        "itemNumber": "22",
                                                        "description": "Sistema de iluminação com fotoperíodo regulável nas áreas controladas e salas de animais",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "000922fd-7c62-4ac0-b74f-ad73ff770eb0",
                                                        "status": "Não se aplica",
                                                        "isHeader": true,
                                                        "itemNumber": "",
                                                        "description": "Ambiente",
                                                        "classification": ""
                                                },
                                                {
                                                        "id": "7170ee2c-2955-4d9c-85c9-1bb650c7a47a",
                                                        "status": "Atende em Partes",
                                                        "itemNumber": "23",
                                                        "description": "Salas de animais com ventilação, exaustão temperatura e umidade controladas, conforme as características das espécies mantidas no recinto",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "e14e9840-50eb-46e3-bcf0-9daf0878df79",
                                                        "status": "Não Verificado",
                                                        "itemNumber": "24",
                                                        "description": "Monitoramento com registro das condições ambientais das salas de animais",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "8d748d78-8267-44b1-a896-302c6d49c170",
                                                        "status": "Não se aplica",
                                                        "isHeader": true,
                                                        "itemNumber": "",
                                                        "description": "Biossegurança",
                                                        "classification": ""
                                                },
                                                {
                                                        "id": "91877260-de9a-40cc-9d3e-45322e65ba84",
                                                        "status": "Não Verificado",
                                                        "itemNumber": "25",
                                                        "description": "Uso de equipamentos de proteção individual preconizados pelo nível de biossegurança da instalação",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "c03a5f01-1283-4edb-a843-fa7907c1d690",
                                                        "status": "Não Verificado",
                                                        "itemNumber": "26",
                                                        "description": "Barreiras sanitárias de bioexclusão e biocontenção preconizadas pelo nível de biossegurança da instalação",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "b9ea7fa5-921f-46f8-ae1b-d78e9d0d134f",
                                                        "status": "Não se aplica",
                                                        "isHeader": true,
                                                        "itemNumber": "",
                                                        "description": "Procedimentos",
                                                        "classification": ""
                                                },
                                                {
                                                        "id": "cb31cc5b-c59c-461c-ab57-f58a3e1110f8",
                                                        "status": "Não Verificado",
                                                        "itemNumber": "27",
                                                        "description": "Manual de Procedimentos Operacionais Padrão (POPs) em biotérios de criação",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "d55e56cc-e1bd-4164-9cb4-1b7c6af63ea6",
                                                        "status": "Não Verificado",
                                                        "itemNumber": "28",
                                                        "description": "Controle genético e sanitário",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "id": "bc87db6d-d7e1-4f50-be3d-189bc1237916",
                                                        "status": "Não Verificado",
                                                        "itemNumber": "29",
                                                        "description": "Alojamento em pares ou grupos, exceto em casos autorizados pela CEUA ou em virtude de condições clínicas",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "418e64e1-1096-45c1-a647-6ff1c3ab6f21",
                                                        "status": "Atende",
                                                        "itemNumber": "30",
                                                        "description": "Procedimentos experimentais não podem ser realizados na sala de manutenção e criação de animais",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "id": "bc4e82b3-4eab-401a-9c78-a7bf80bf222a",
                                                        "status": "Não Verificado",
                                                        "itemNumber": "31",
                                                        "description": "Enriquecimento Ambiental",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "TABELA AUXILIAR - CRITÉRIO MÍNIMOS PARA CRIAÇÃO, MANUTENÇÃO E EXPERIMENTAÇÃO DE ROEDORES E LAGOMORFOS (RN 57)"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "094b2ea1-72cf-4b29-ba44-685614940f6c",
                                "data": {
                                        "title": " não‑conformidades críticas – ação imediata"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "500a46a7-ed57-4c95-9420-af3711cf1b52",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Área destinada à higienização separada fisicamente da área de salas de animais",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "ÁREA DE SERVIÇO"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "d4938a13-c310-4c72-a331-379891314b35",
                                "data": {
                                        "text": "Análise: Não existe área destinada para este fim na planta e este é um item obrigatório\n",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "f88ed9a9-ce0d-499e-a4d6-fa1efbaf4012",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "tens 13 e 14 Local próprio para o alojamento e acondicionamento de alimentos e forração \n",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "2",
                                                        "description": "Área exclusiva para depósito de resíduos",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "3",
                                                        "description": "Freezer para acondicionamento de carcaças",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "ÁREA DE DEPÓSITOS"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "067393a3-8c5e-4d82-94f3-b58ef97042a3",
                                "data": {
                                        "text": "Embora a área esteja em reforma, não prevê locais próprios para armazenamento e acondicionamento de alimento e forração. Estes são pontos obrigatórios pela RN57, então consideramos o status críticos estes pontos Da mesma forma para a falta de um local próprio para armazenamento de resíduos e carcaças.",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "2fa9b8a8-1047-4be5-8a6c-ff1da79d7ba1",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Paredes, pisos e tetos lisos, livres de rejuntes e reentrâncias, construídos com materiais que possibilitem higienização e desinfecção\n",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "DETALHES CONSTRUTIVOS"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "6510cab3-db0c-4284-81f9-32e2672edf22",
                                "data": {
                                        "text": "Análise: Embora a área esteja em reforma e não possamos analisar e o teto da sala de manutenção de animais, o piso possui degraus e rejuntes, a ausência destes pontos são obrigatórios pela RN57, então consideramos o status críticos. Neste mesmo contexto, encontram-se as paredes, pois possuem canos aparente, o que não condiz com paredes lisas, como os solicitados pelo checklist. ",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "1f363cbb-82c0-4c8b-9896-e760b8228c48",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Sistema de monitoramento remoto  ",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": ""
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "620b5d97-2de2-4400-990f-ef687c69b3da",
                                "data": {
                                        "text": "Embora a área esteja em reforma, não está presente este item",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "75279f4d-ba37-4a0b-bef5-31d4334df380",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Salas de animais com ventilação, exaustão temperatura e umidade controladas",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "AMBIENTE"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "1156ab9d-897b-4732-ad23-cc0cb995a96b",
                                "data": {
                                        "text": "Embora a área esteja em reforma e não possamos analisar o sistema funcionando, verificamos salas de procedimentos sem ar-condicionado e exaustão. A climatização dentro das salas é item obrigatórios pela RN57, então consideramos o status críticos.",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "e47ee419-4c11-41e4-bb94-334717e56577",
                                "data": {
                                        "text": "Com a área em reforma, não foi possível analisar os procedimentos ",
                                        "align": "justify",
                                        "title": "PROCEDIMENTOS"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "9f7b3aec-0f2c-4b97-a442-15e1cba6086d",
                                "data": {
                                        "title": "Sugestões de correção e melhorias"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "a27f8a7e-7229-46a8-9888-1eb3819fc15a",
                                "data": {
                                        "text": "Criar área de higienização (Item 7): na área de experimentação é fundamental a presença de uma área para a higienização dos materiais. Esta área precisa ser o mais isolada possível já que é um local que produz muito ruído e onde existe a dispersão de patógenos no ar. \nCriar áreas exclusivas para depósitos de alimentos (item 13), forração (item 14) e resíduo (item 15). A manutenção de alimentos, precisa ser feita seguindo as necessidades do fabricante da ração. E todos estes matérias precisam ser segregados, já que cada um tem sua especificidade.\nA presença de um freezer para acondicionar carcaças é fundamental, a não ser que este exista este equipamento em outro local, próximo do Biotério. \nEm relação aos detalhes construtivos, a reforma da área está sendo executada e temos uma sugestão de planta para fornecer, No entanto é importante que atentem para os materiais que serão utilizados, pois paredes tetos e pisos precisam ser lisos, sem rejuntes e resistentes a lavagem com produtos químicos. Do que se pode ver hoje, as paredes possuem canos aparentes, que devem ser revistos, o piso não é liso (item 18)\nClimatizar todos os ambientes (item 23):  Em algumas salas existe a climatização e em outras não. A obra precisa prever isso. Este é um dos itens mais fundamental, já que afeta diretamente a saúde e o bem estar dos animais. \n",
                                        "align": "justify",
                                        "title": "Críticas (ação imediata)"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "cfb39b5d-3a3e-4cd8-8327-d30d4ca9d6b5",
                                "data": {
                                        "text": "Instalar controle de acesso com vestiários e barreira sanitária.\n",
                                        "align": "justify",
                                        "title": " Alta prioridade"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "b3390c76-ad67-4751-9038-ef7ce35cfc23",
                                "data": {
                                        "title": "sugestões de adequações arquitetônicas para conformidade rn 57"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "19d36457-d9be-4fc0-8f81-b4bb0de1b9cc",
                                "data": {
                                        "text": "Anexo este relatório encaminhamos a sugestão de desenho arquitetônica elaborada com o objetivo de atender integralmente às diretrizes estabelecidas na Resolução Normativa nº 57 do CONCEA, contemplando os fluxos de trabalho, áreas funcionais e requisitos mínimos necessários para garantir a conformidade regulatória e a adequada operação do biotério.\n",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "9503baf4-99e3-43b2-8158-9c1a1dc734ee",
                                "data": {
                                        "title": "Considerações finais"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "3edeaedb-7e24-40b2-8e3d-e3735438db7a",
                                "data": {
                                        "text": "A consultoria realizada permitiu identificar de forma sistemática diversas não conformidades classificadas como críticas, de prioridade alta e média, que comprometem a conformidade com as normativas vigentes, bem como a segurança e o bem-estar dos animais e dos profissionais envolvidos. A análise evidenciou a necessidade de adequações estruturais e de fluxos internos para garantir a implementação das boas práticas de laboratório e atender aos requisitos estabelecidos pelos órgãos regulatórios.\nComo encaminhamento, foi elaborado e apresentado um desenho preliminar de sugestão de planta arquitetônica, contemplando os ajustes necessários, a fim de orientar a instituição na adequação do biotério, assegurando maior eficiência operacional, conformidade legal e sustentabilidade a longo prazo. Ressalta-se que a execução dessas medidas é fundamental para alcançar padrões de excelência em pesquisa e garantir a credibilidade institucional, bem como para requerer o licenciamento do CONCEA/Ministério de Ciência e Tecnologia.\n",
                                        "align": "justify",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "79118d4c-5062-4e14-84a7-e66ebc678cea",
                                "data": {
                                        "fileUrl": "https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/project-files/reports/attachments/a0f886d3-98cb-4288-b5cf-6663078899c2.pdf",
                                        "fileName": "Planta Karla UPEA 4.pdf"
                                },
                                "type": "pdf_attachment"
                        }
                ],
                "images": [],
                "status": "draft",
                "pdf_url": null,
                "created_at": "2026-01-29T21:07:46.723309+00:00",
                "updated_at": "2026-02-20T21:24:46.116+00:00",
                "projects": {
                        "title": "Consultoria 02",
                        "clients": {
                                "name": "FUNDACAO PARA O DESENVOLVIMENTO MEDICO E HOSPITALAR"
                        }
                }
        },
        {
                "id": "2141cf5e-2284-40d9-9fea-b8839a1a7614",
                "project_id": "d4f5a8e1-1f50-46d4-894e-d44fdd29463e",
                "title": "UNIDADE DE PESQUISA EXPERIMENTAL-UNIPEX  BLOCO CIRÚRGICO UNESP-BOTUCATU",
                "type": "Consultoria",
                "content": [
                        {
                                "id": "7940bd88-c094-41c2-af00-038705b8de2f",
                                "data": {
                                        "generalStatus": "Múltiplas não conformidades críticas",
                                        "criticalImages": 10,
                                        "evaluationDate": "29/01/2026",
                                        "imagesAnalyzed": 125
                                },
                                "type": "executive_summary"
                        },
                        {
                                "id": "a225eff5-af99-4375-bf0e-a119074794dd",
                                "data": {
                                        "text": "1. Não Conformidades Críticas – Ação Imediata\nRepresentam falhas graves que comprometem diretamente a segurança, a conformidade regulatória ou o bem-estar animal.\nExigem ação corretiva imediata, podendo inclusive demandar a suspensão de atividades até a resolução.\nBaseado na RN57 do CONCEA a classificação é OBRIGATÓRIA e o status NÃO ATENDE. \n2. Não Conformidades de Alta Prioridade\nSão falhas significativas que não causam impacto imediato crítico, mas que podem evoluir para situações de risco ou comprometer auditorias/acreditações.\nExigem correção em curto prazo. \nBaseado na RN57 do CONCEA a classificação é OBRIGATÓRIA e o status ATENDE EM PARTES. \n3. Não Conformidades de Prioridade Média\nSão falhas de impacto moderado, que não comprometem imediatamente a conformidade ou a segurança, mas indicam necessidade de ajustes.\nExigem ação corretiva planejada, podendo ser tratadas em médio prazo. \nBaseado na RN57 do CONCEA a classificação é RECOMENDADA e o status NÃO ATENDE\n",
                                        "title": "SUMÁRIO PARA A CLASSIFICAÇÃO DAS NÃO CONFORMIDADES"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "fb323417-5c09-4267-a55d-b0dd4d084d6a",
                                "data": {
                                        "title": "ANÁLISE de conformidades e não-conformidades em relação a resolução normativa 57/concea"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "f683db5f-3239-4e58-8eeb-467ebfa7d876",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Não se aplica",
                                                        "itemNumber": "1",
                                                        "description": "Biotérios de criação de animais, que realizam a reprodução de animais, separados de biotérios com outras finalidades.\nEm edificação que abrigue biotérios de diferentes finalidades (criação, manutenção e utilização), as instalações de criação devem ter suas áreas físicas e rotinas com barreiras exclusivas, delimitadas e separadas dos biotérios de manutenção e de utilização\n\n",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Ambientes Físicos da Instalação Animal"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "d5d7159f-dd74-440d-9987-28c743a7fffa",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Não Atende",
                                                        "itemNumber": "1",
                                                        "description": "Área administrativa",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "status": "Não Atende",
                                                        "itemNumber": "2",
                                                        "description": "Área de recepção de pessoal (usuários e visitantes)\n\n",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "status": "Não se aplica",
                                                        "itemNumber": "3",
                                                        "description": "No biotério de criação, o ingresso de animais deve ocorrer por meio da área de recepção de animais e quarentena\n\n",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não se aplica",
                                                        "itemNumber": "4",
                                                        "description": "No biotério de manutenção ou experimentação, o ingresso de animais deve ocorrer por meio de recepção em área de quarentena, exceto com relação aos animais com estado sanitário conhecido e compatível com o biotério de manutenção ou de experimentação de destino, que poderão ser introduzidos diretamente na sala de animais",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Áreas de Apoio"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "fa5da8e2-454e-40e3-8780-5cece4691504",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Não Atende",
                                                        "itemNumber": "1",
                                                        "description": "Área destinada à higienização (lavagem, desinfecção ou esterilização de materiais) separada fisicamente da área de salas de animais\n\n",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "2",
                                                        "description": "Sanitários localizados fora das áreas controladas em biotérios de criação",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende em Partes",
                                                        "itemNumber": "3",
                                                        "description": "Salas de animais separadas por espécie",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "4",
                                                        "description": "Vestiário",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não se aplica",
                                                        "itemNumber": "5",
                                                        "description": "Sala destinada à eutanásia, separada das salas de animais, em biotérios de criação e manutenção\n\n",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "6",
                                                        "description": "Sala destinada a eutanásia, separada das salas de manutenção de animais, em biotérios de experimentação\n\n",
                                                        "classification": "Recomendado"
                                                }
                                        ],
                                        "title": "Áreas de Serviço"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "7c7a12a6-8f79-478a-a6ee-242e55f51985",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Não Atende",
                                                        "itemNumber": "1",
                                                        "description": "Local para estocagem de alimentos e forração que atendam às recomendações dos fabricantes",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não Atende",
                                                        "itemNumber": "2",
                                                        "description": "Alimentos e forração sem contato com o piso ou paredes\n\n",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "3",
                                                        "description": "Área exclusiva para depósitos de resíduos",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "4",
                                                        "description": "Local para armazenamento de produtos químicos e medicamentos",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "5",
                                                        "description": "Freezer para acondicionamento de carcaças",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Depósitos"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "9d03020b-327a-410b-8238-813f061445c6",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Atende em Partes",
                                                        "itemNumber": "1",
                                                        "description": "Paredes, pisos e tetos lisos, livres de rejuntes e reentrâncias, construídos com materiais que possibilitem higienização e desinfecção",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende em Partes",
                                                        "itemNumber": "2",
                                                        "description": "Ausência de janelas com acesso direto para as salas de animais de laboratório\n\n",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "3",
                                                        "description": "Grupo gerador próprio para fornecimento emergencial de energia elétrica",
                                                        "classification": "Recomendado"
                                                },
                                                {
                                                        "status": "Não Verificado",
                                                        "itemNumber": "4",
                                                        "description": "Sistema de monitoramento remoto da ambiência das salas dos animais, na ausência de grupo gerador próprio\n\n",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende em Partes",
                                                        "itemNumber": "5",
                                                        "description": "Sistema de iluminação com fotoperíodo regulável nas áreas controladas e salas de animais\n\n",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Detalhes Construtivos"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "7687922f-7087-49f4-a581-4417fdd7424e",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Atende em Partes",
                                                        "itemNumber": "1",
                                                        "description": "Salas de animais com ventilação, exaustão temperatura e umidade controladas, conforme as características das espécies mantidas no recinto",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não Atende",
                                                        "itemNumber": "2",
                                                        "description": "Monitoramento com registro das condições ambientais das salas de animais\n\n",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Ambiente"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "da363cca-76ca-4fff-b622-7b6639ddc0a0",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "1",
                                                        "description": "Uso de equipamentos de proteção individual preconizados pelo nível de biossegurança da instalação",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende em Partes",
                                                        "itemNumber": "2",
                                                        "description": "Barreiras sanitárias de bioexclusão e biocontenção preconizadas pelo nível de biossegurança da instalação\n\n",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Biossegurança"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "07f03b5c-0155-4f46-b58f-7607ff3cba2e",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Não Verificado",
                                                        "itemNumber": "1",
                                                        "description": "Manual de Procedimentos Operacionais Padrão (POPs) em biotérios de criação\n\n",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não Verificado",
                                                        "itemNumber": "2",
                                                        "description": "Controle genético e sanitário",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não se aplica",
                                                        "itemNumber": "3",
                                                        "description": "Alojamento em pares ou grupos, exceto em casos autorizados pela CEUA ou em virtude de condições clínicas\n\n",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Atende",
                                                        "itemNumber": "4",
                                                        "description": "Procedimentos experimentais não podem ser realizados na sala de manutenção e criação de animais\n\n",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não Verificado",
                                                        "itemNumber": "5",
                                                        "description": "Enriquecimento Ambiental\n\n",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não se aplica",
                                                        "itemNumber": "6",
                                                        "description": "",
                                                        "classification": "Obrigatório"
                                                },
                                                {
                                                        "status": "Não se aplica",
                                                        "itemNumber": "7",
                                                        "description": "",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Procedimentos"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "4a0b2fe3-6c57-463f-ac95-d15fc2e856ba",
                                "data": {
                                        "title": "Não‑conformidadeS CRÍTICAS – AÇÃO IMEDIATA"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "c172fab5-11cd-40f0-98e8-9d66c5237088",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Área destinada à higienização separada fisicamente da área de sala dos animais",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": " ÁREAS DE SERVIÇO"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "78d621e6-049f-494d-9703-8ed6c14eeaf7",
                                "data": {
                                        "title": "Nova Observação",
                                        "images": [
                                                {
                                                        "url": "https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/project-images/reports/0.2234364315927142.png",
                                                        "caption": ""
                                                },
                                                {
                                                        "url": "https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/project-images/reports/0.7076002000158034.png",
                                                        "caption": ""
                                                }
                                        ],
                                        "severity": "medium",
                                        "description": ""
                                },
                                "type": "observation"
                        },
                        {
                                "id": "e4adc5c6-4f6c-40f8-87ce-290c6fbf442a",
                                "data": {
                                        "text": "Análise: A área destinada para este fim não é isolada, conforme a solicitação da RN57\n"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "0203dbda-bbb6-4b2c-892c-5dd58e227758",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Salas de animais separadas por espécie ",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": ""
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "c8e835f9-7004-4a2d-bfe4-81b88fbd8adc",
                                "data": {
                                        "text": "Análise: como as salas de animais, são salas experimentais cirúrgicas ou para procedimentos invasivos, não existe uma sala para cada espécie. As salas são multiespécies. Por isso, os Procedimentos Operacionais Padrão (POPs) para estas áreas precisam sem extremamente detalhados e deixar claro todos os procedimentos de limpeza e desinfecção executados quando da utilização de cada espaço e quando da troca de espécies. \n"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "812eb132-1de0-4b4e-9b2c-4deb7ff80a30",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Local próprio para o alojamento e acondicionamento de alimentos e forração",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": " ÁREA DE DEPÓSITOS"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "f2f096d2-25a3-4fe5-9a1b-2eb380125d5c",
                                "data": {
                                        "text": "Análise: Esta área corresponde a um biotério experimental e, portanto, precisa prever locais próprios para armazenamento e acondicionamento de alimento e forração. Estes são pontos obrigatórios pela RN57"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "c902fdb0-4247-409d-b4c8-c5a342ac9fd4",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Paredes, pisos e tetos lisos, livres de rejuntes e reentrâncias construídos com materiais que possibilitem higienização e desinfecção\n\n",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "DETALHES CONSTRUTIVOS"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "b5953ff6-e0ce-4721-a777-a85fbd1e9c19",
                                "data": {
                                        "align": "justify",
                                        "title": "",
                                        "images": [
                                                {
                                                        "url": "https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/project-images/reports/0.4280703166026293.jpeg",
                                                        "caption": ""
                                                },
                                                {
                                                        "url": "https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/project-images/reports/0.33490459920543625.jpeg",
                                                        "caption": ""
                                                },
                                                {
                                                        "url": "https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/project-images/reports/0.6680958590550125.jpeg",
                                                        "caption": ""
                                                },
                                                {
                                                        "url": "https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/project-images/reports/0.5039901045185688.jpeg",
                                                        "caption": ""
                                                },
                                                {
                                                        "url": "https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/project-images/reports/0.49043921034596727.jpeg",
                                                        "caption": ""
                                                }
                                        ],
                                        "severity": "medium",
                                        "description": ""
                                },
                                "type": "observation"
                        },
                        {
                                "id": "64042fdd-8c58-4927-8376-e2ee6a0a92c3",
                                "data": {
                                        "text": "Análise: Atende parcialmente: Neste biotério experimental existem duas áreas distintas. A área considerada como bloco cirúrgico, está de acordo com o item 17 em relação a pisos, paredes e tetos. Com exceção das portas e marcos que são de madeira, incorreto para estas áreas limpas, os demais itens estão em acordo. No entanto, neste mesmo biotério existem salas experimentais para procedimentos invasivos que, embora isoladas, fazem parte do todo, que não estão de acordo. Possuem paredes com azulejos, pias dentro das salas, sala de procedimentos sem isolamento correto com a área administrativa. Este é um ponto crítico importante"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "1646b75c-e423-4cd0-84b8-390dbc787128",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Ausência de janelas",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": ""
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "1b7564fb-8786-4024-bb6f-efbb3a6346b1",
                                "data": {
                                        "align": "justify",
                                        "title": "",
                                        "images": [
                                                {
                                                        "url": "https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/project-images/reports/0.8790137900446691.jpeg",
                                                        "caption": ""
                                                }
                                        ],
                                        "severity": "medium",
                                        "description": ""
                                },
                                "type": "observation"
                        },
                        {
                                "id": "636bff23-0a98-4dbc-8b11-46e47d214a55",
                                "data": {
                                        "text": "Análise: Atende parcialmente: A área do Bloco cirúrgico atende a este quesito, já a área das salas experimentais possui janelas diretas para a rua, o que é proibido e crítico para a RN 57."
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "496446a1-d060-4f60-b28d-899c25f0b3dd",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Sistema de monitoramento remoto",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": ""
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "b730c7a4-dd6e-463d-a6eb-09becdde026e",
                                "data": {
                                        "text": "Não foi verificado a presença deste item pelo consultor"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "fdafe0d4-b845-4091-8673-018547366c5e",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Sistema de iluminação ",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": ""
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "4b8fe74d-6420-4de0-a26e-95091b363c87",
                                "data": {
                                        "text": "Análise: Atende parcialmente: A área do Bloco cirúrgico atende a este quesito, já a área das salas experimentais possui janelas diretas para a rua, o que não permite o controle da iluminação, condição crítica para o bem-estar animal e não aceita pela RN 57.\n"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "fec0ef94-40a9-4714-a7d5-02a51fb6a9c0",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Salas de animais com ventilação, exaustão temperatura e umidade controladas",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "AMBIENTE"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "c3d2394a-8a85-47cf-987b-fcc489d4e4eb",
                                "data": {
                                        "text": "Análise: Nas salas de procedimentos a climatização não é adequada. Item obrigatórios pela RN57, então consideramos o status crítico."
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "22bb5951-8622-4a63-ba4e-ced7524d1a1c",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Crítico",
                                                        "itemNumber": "1",
                                                        "description": "Monitoramento com registro",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Nova Tabela de Conformidade"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "b1ee6432-7970-4d6d-9692-31961b5c0b3c",
                                "data": {
                                        "text": "Não foi verificado a presença deste item pelo consultor",
                                        "title": ""
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "18dcb8a7-2561-477a-949b-87131ec4dfb1",
                                "data": {
                                        "items": [
                                                {
                                                        "status": "Não Atende",
                                                        "itemNumber": "1",
                                                        "description": "Barreiras sanitárias ",
                                                        "classification": "Obrigatório"
                                                }
                                        ],
                                        "title": "Biossegurança"
                                },
                                "type": "compliance_table"
                        },
                        {
                                "id": "0e653557-8463-4525-918d-6981f289226a",
                                "data": {
                                        "title": "Entrada diretamente do exterior sem nenhuma barreira",
                                        "images": [
                                                {
                                                        "url": "https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/project-images/reports/0.8222667823687425.png",
                                                        "caption": ""
                                                },
                                                {
                                                        "url": "https://vervrmflqvjbtxxpicmg.supabase.co/storage/v1/object/public/project-images/reports/0.1851933506030855.png",
                                                        "caption": ""
                                                }
                                        ],
                                        "severity": "medium",
                                        "description": ""
                                },
                                "type": "observation"
                        },
                        {
                                "id": "e4d4c106-e7c5-4231-8a0d-3c1be91f0d8c",
                                "data": {
                                        "text": "Análise: A entrada de pessoal e animais no bloco cirúrgico, é feita diretamente da rua, não existindo uma barreira de biocontenção adequada. Já para as salas experimentais, essa barreira existe. \n"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "6f69606d-3d7f-42cf-b75e-a0dbea894cea",
                                "data": {
                                        "title": "Sugestões de correção e melhorias"
                                },
                                "type": "section_header"
                        },
                        {
                                "id": "6c8afd81-b380-4218-9ce2-4ed32c64c8ba",
                                "data": {
                                        "text": "1-Criar uma antessala na entrada do bloco cirúrgico para a entrada de pessoas e animais, com abertura de portas intertravadas, evitando que ocorra entrada do ar exterior diretamente no ambiente limpo (barreira de biocontenção). \n2-  Isolar área de higienização: Esta área precisa ser o mais isolada possível já que é um local que produz muito ruído e onde existe a dispersão de patógenos no ar. \n3- Criar áreas exclusivas para depósitos de alimentos, forração e resíduo. A manutenção de alimentos, precisa ser feita seguindo as necessidades do fabricante da ração. E todos estes materiais precisam ser segregados, já que cada um tem sua especificidade.\nEm relação aos detalhes construtivos, os itens críticos ocorrem nos laboratórios experimentais. É preciso retirar azulejos das paredes; portas de madeiras são proibidas em áreas limpas pela dificuldade de higienização; as salas de procedimento precisam ser isoladas de áreas administrativas. As janelas precisam ser fechadas e deve ser instalado um controle de luz ambiental\n4- Climatizar todos os ambientes :  As salas experimentais precisam de climatização. Este é um dos itens mais fundamental, já que afeta diretamente a saúde e o bem-estar dos animais.\n",
                                        "title": "4.1 Críticas (ação imediata)"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "fd422809-ee2c-4c3c-b6a1-25071cd5adbe",
                                "data": {
                                        "text": "1- Instalar controle de acesso.\n2- Trocas portas de madeiras para ajudar na higienização correta dos ambientes e possibilitar melhor vedação dos ambientes. \n",
                                        "title": " Alta prioridade"
                                },
                                "type": "text_section"
                        },
                        {
                                "id": "058dc1ac-1bf1-483f-97c1-3e656a2a6980",
                                "data": {
                                        "text": "Transformar a UNIPEX em um grande bloco de biotérios experimentais o que permitiria evitar duplicação de espaços (ex: depósitos), economizaria mão de obra e otimizaria fluxos de trabalho.",
                                        "title": "Não conformidades de prioridade média "
                                },
                                "type": "text_section"
                        }
                ],
                "images": [],
                "status": "draft",
                "pdf_url": null,
                "created_at": "2026-01-29T21:54:24.994879+00:00",
                "updated_at": "2026-02-20T21:25:49.879+00:00",
                "projects": {
                        "title": "Consultoria 02",
                        "clients": {
                                "name": "FUNDACAO PARA O DESENVOLVIMENTO MEDICO E HOSPITALAR"
                        }
                }
        },
        {
            id: "ct-vacinas-report-001",
            project_id: "ct-vacinas-project-001",
            title: "CT Vacinas - Planta Original",
            type: "Consultoria",
            status: "draft",
            created_at: "2026-08-04T12:00:00.000Z",
            projects: {
                title: "CT Vacinas",
                clients: { name: "CT VACINAS" }
            },
            content: []
        },
        {
            id: "ct-vacinas-report-ufmg-002",
            project_id: "ct-vacinas-project-001",
            title: "CT Vacinas - Planta Original",
            type: "Consultoria",
            status: "draft",
            created_at: "2026-08-04T12:00:00.000Z",
            projects: {
                title: "CT Vacinas",
                clients: { name: "UNIVERSIDADE FEDERAL DE MINAS GERAIS" }
            },
            content: []
        }
    ]
};

// LocalStorage Persistence Helpers
const getLocalData = (table: string): any[] => {
    const seed = INITIAL_SEEDS[table] || [];
    try {
        const item = localStorage.getItem(`vivens_db_${table}`);
        if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const seedIds = new Set(seed.map((s: any) => s.id));
                const customLocal = parsed.filter((p: any) => !seedIds.has(p.id));
                const merged = [...seed, ...customLocal];
                setLocalData(table, merged);
                return merged;
            }
        }
    } catch {}
    if (seed.length > 0) {
        setLocalData(table, seed);
    }
    return seed;
};

const setLocalData = (table: string, data: any[]) => {
    try {
        localStorage.setItem(`vivens_db_${table}`, JSON.stringify(data));
    } catch {
        // Ignore storage full or quota errors
    }
};

const getCorePayload = (table: string, item: any) => {
    const id = item.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2));
    const created_at = item.created_at || new Date().toISOString();

    if (table === 'clients') {
        const fullAddr = item.address || `${item.street || ''}, ${item.number || ''} - ${item.neighborhood || ''}, ${item.city || ''}/${item.state || ''}`.replace(/^[\s,-/]+|[\s,-/]+$/g, '');
        return {
            id,
            name: item.name || item.fantasy_name || 'Novo Cliente',
            document: item.document || '',
            email: item.email || '',
            phone: item.phone || '',
            address: fullAddr,
            status: item.status || 'active',
            created_at
        };
    }
    if (table === 'projects') {
        return {
            id,
            title: item.title || 'Novo Projeto',
            client_id: item.client_id || null,
            status: item.status || 'active',
            start_date: item.start_date || null,
            end_date: item.end_date || null,
            description: item.description || '',
            created_at
        };
    }
    if (table === 'reports') {
        return {
            id,
            title: item.title || 'Novo Relatório',
            project_id: item.project_id || null,
            type: item.type || 'relatorio',
            status: item.status || 'draft',
            content: typeof item.content === 'object' ? JSON.stringify(item.content) : (item.content || ''),
            created_at
        };
    }
    return { id, created_at, ...item };
};

const enrichRelations = (table: string, item: any) => {
    if (!item) return item;
    const enriched = { ...item };

    if (table === 'projects') {
        if (!enriched.clients && enriched.client_id) {
            const allClients = getLocalData('clients');
            const foundClient = allClients.find((c: any) => c.id === enriched.client_id);
            if (foundClient) {
                enriched.clients = { name: foundClient.name || foundClient.fantasy_name || '' };
            }
        }
    }

    if (table === 'reports') {
        if (enriched.project_id) {
            const allProjects = getLocalData('projects');
            const foundProject = allProjects.find((p: any) => p.id === enriched.project_id);
            if (foundProject) {
                let clientObj = foundProject.clients;
                if (!clientObj && foundProject.client_id) {
                    const allClients = getLocalData('clients');
                    const foundClient = allClients.find((c: any) => c.id === foundProject.client_id);
                    if (foundClient) {
                        clientObj = { name: foundClient.name || foundClient.fantasy_name || '' };
                    }
                }
                enriched.projects = {
                    title: foundProject.title || '',
                    clients: clientObj || { name: '' }
                };
            }
        }
    }

    return enriched;
};

// Mock Query Builder
class QueryBuilder {
    table: string;
    params: URLSearchParams;
    isSingle: boolean;
    updateData: any | null;
    isDelete: boolean;

    constructor(table: string) {
        this.table = table;
        this.params = new URLSearchParams();
        this.isSingle = false;
        this.updateData = null;
        this.isDelete = false;
    }

    select(cols: string = '*') {
        this.params.append('select', cols);
        return this;
    }

    eq(col: string, val: string | number) {
        this.params.append(`${col}.eq`, val.toString());
        return this;
    }

    single() {
        this.isSingle = true;
        this.params.append('single', 'true');
        return this;
    }

    order(col: string, options: { ascending?: boolean } = {}) {
        this.params.append('order', col);
        if (options.ascending === false) {
            this.params.append('orderDesc', 'true');
        }
        return this;
    }

    update(data: any) {
        this.updateData = data;
        return this;
    }

    delete() {
        this.isDelete = true;
        return this;
    }

    // Resolves automatically if awaited
    then(resolve: (value: any) => void, reject: (reason?: any) => void) {
        if (this.updateData) {
            this.handleUpdate().then(resolve).catch(reject);
        } else if (this.isDelete) {
            this.handleDelete().then(resolve).catch(reject);
        } else {
            this.handleSelect().then(resolve).catch(reject);
        }
    }

    async handleSelect() {
        const headers = getHeaders();
        if (headers.Authorization) {
            const url = `${API_URL}/${this.table}.php?${this.params.toString()}`;
            try {
                const res = await fetch(url, { headers });
                const data = await res.json();
                if (res.ok && !data.error && Array.isArray(data)) {
                    const local = getLocalData(this.table);
                    const serverIds = new Set(data.map((d: any) => d.id));
                    const localOnly = local.filter((l: any) => !serverIds.has(l.id));
                    const merged = [...data, ...localOnly];
                    setLocalData(this.table, merged);
                    const enrichedMerged = merged.map(item => enrichRelations(this.table, item));
                    return { data: this.isSingle ? (enrichedMerged[0] || null) : enrichedMerged, error: null };
                }
            } catch (e) {}
        }

        let local = getLocalData(this.table);
        const eqCol = Array.from(this.params.entries()).find(([k]) => k.endsWith('.eq'));
        if (eqCol) {
            const [k, val] = eqCol;
            const colName = k.replace('.eq', '');
            local = local.filter((item: any) => String(item[colName]) === String(val));
        }
        const enrichedLocal = local.map(item => enrichRelations(this.table, item));
        return { data: this.isSingle ? (enrichedLocal[0] || null) : enrichedLocal, error: null };
    }

    async handleUpdate() {
        const data = this.updateData;
        const eqParam = Array.from(this.params.entries()).find(([k]) => k.endsWith('.eq'));
        const targetId = eqParam ? eqParam[1] : (data?.id || null);

        if (targetId) {
            const local = getLocalData(this.table);
            const updated = local.map(item => item.id === targetId ? { ...item, ...data } : item);
            setLocalData(this.table, updated);
        }

        const headers = getHeaders();
        if (headers.Authorization) {
            try {
                const res = await fetch(`${API_URL}/${this.table}.php?${this.params.toString()}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (res.ok && !result.error) {
                    return { data: result, error: null };
                }
            } catch (error: any) {}
        }

        const local = getLocalData(this.table);
        const item = local.find(i => i.id === targetId) || data;
        return { data: [item], error: null };
    }

    async handleDelete() {
        const eqParam = Array.from(this.params.entries()).find(([k]) => k.endsWith('.eq'));
        const targetId = eqParam ? eqParam[1] : null;

        if (targetId) {
            const local = getLocalData(this.table);
            const filtered = local.filter(item => item.id !== targetId);
            setLocalData(this.table, filtered);
        }

        const headers = getHeaders();
        if (headers.Authorization) {
            try {
                const res = await fetch(`${API_URL}/${this.table}.php?${this.params.toString()}`, {
                    method: 'DELETE',
                    headers
                });
            } catch (error: any) {}
        }

        return { data: { success: true }, error: null };
    }

    async insert(data: any | any[]) {
        const items = Array.isArray(data) ? data : [data];
        const local = getLocalData(this.table);

        const preparedItems = items.map(item => getCorePayload(this.table, item));
        const updatedLocal = [...preparedItems, ...local];
        setLocalData(this.table, updatedLocal);

        // 1. Try sending full payload
        try {
            const res = await fetch(`${API_URL}/${this.table}.php`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (res.ok && Array.isArray(result) && result.length > 0) {
                return { data: result, error: null };
            }
        } catch (error: any) {
            // Silently retry
        }

        // 2. Retry with sanitized core payload matching exact MySQL table columns
        try {
            const res = await fetch(`${API_URL}/${this.table}.php`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(preparedItems)
            });
            const result = await res.json();
            if (res.ok && Array.isArray(result) && result.length > 0) {
                return { data: result, error: null };
            }
        } catch (error: any) {}

        return { data: preparedItems, error: null };
    }
}

// Mock Storage
const storage = {
    from(bucket: string) {
        return {
            async upload(path: string, file: File) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('bucket', bucket);
                    formData.append('path', path);

                    // Upload needs multipart/form-data so we do not pass Content-Type header manually
                    const headers = getHeaders();
                    delete headers['Content-Type'];

                    const res = await fetch(`${API_URL}/upload.php`, {
                        method: 'POST',
                        headers,
                        body: formData
                    });
                    const result = await res.json();
                    if (!res.ok || result.error) throw new Error(result.error || 'Upload failed');
                    return { data: result.data, error: null };
                } catch (error: any) {
                    return { data: null, error };
                }
            },
            getPublicUrl(path: string) {
                return {
                    data: { publicUrl: `${API_URL}/uploads/${bucket}/${path.replace(/^[/]+/, '')}` }
                };
            }
        };
    }
};

// Export the mock client replacing Supabase
export const supabase = {
    auth,
    from: (table: string) => new QueryBuilder(table),
    storage
};
