-- Historical reference only.
-- Official operational seed is now implemented in prisma/seed.ts (Prisma + Argon2id).

INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Administrador', 'admin@fatec.sp.gov.br', crypt('Admin@123', gen_salt('bf', 10)), 'ADMIN'),
  ('Secretaria Acadêmica', 'secretaria@fatec.sp.gov.br', crypt('Secretaria@123', gen_salt('bf', 10)), 'SECRETARIA')
ON CONFLICT (email) DO UPDATE
SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  updated_at = NOW();

CREATE OR REPLACE FUNCTION upsert_navigation_node(
  p_parent_slug VARCHAR,
  p_title VARCHAR,
  p_slug VARCHAR,
  p_prompt TEXT,
  p_answer_summary TEXT,
  p_evidence_excerpt TEXT,
  p_evidence_source VARCHAR,
  p_display_order INTEGER,
  p_is_active BOOLEAN
)
RETURNS VOID AS $seed$
DECLARE
  v_parent_id BIGINT;
BEGIN
  IF p_parent_slug IS NOT NULL THEN
    SELECT id INTO v_parent_id
    FROM navigation_nodes
    WHERE slug = p_parent_slug
    LIMIT 1;
  ELSE
    v_parent_id := NULL;
  END IF;

  INSERT INTO navigation_nodes (
    parent_id,
    title,
    slug,
    prompt,
    answer_summary,
    evidence_excerpt,
    evidence_source,
    display_order,
    is_active
  )
  VALUES (
    v_parent_id,
    p_title,
    p_slug,
    p_prompt,
    p_answer_summary,
    p_evidence_excerpt,
    p_evidence_source,
    p_display_order,
    p_is_active
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    parent_id = EXCLUDED.parent_id,
    title = EXCLUDED.title,
    prompt = EXCLUDED.prompt,
    answer_summary = EXCLUDED.answer_summary,
    evidence_excerpt = EXCLUDED.evidence_excerpt,
    evidence_source = EXCLUDED.evidence_source,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
END;
$seed$ LANGUAGE plpgsql;

-- Pergunta inicial: cursos no primeiro nível
SELECT upsert_navigation_node(
  NULL,
  'Desenvolvimento de Software Multiplataforma',
  'dsm',
  $$Para qual assunto você gostaria de obter informações?$$,
  NULL,
  NULL,
  NULL,
  1,
  TRUE
);

SELECT upsert_navigation_node(
  NULL,
  'Geoprocessamento',
  'geo',
  $$Para qual assunto você gostaria de obter informações?$$,
  NULL,
  NULL,
  NULL,
  2,
  TRUE
);

SELECT upsert_navigation_node(
  NULL,
  'Meio Ambiente e Recursos Hídricos',
  'marh',
  $$Para qual assunto você gostaria de obter informações?$$,
  NULL,
  NULL,
  NULL,
  3,
  TRUE
);

SELECT upsert_navigation_node(
  NULL,
  'Não sou aluno',
  'nao-sou-aluno',
  $$Para qual assunto você gostaria de obter informações?$$,
  NULL,
  NULL,
  NULL,
  4,
  TRUE
);

SELECT upsert_navigation_node(
  NULL,
  'SIGA - Sistema Acadêmico',
  'siga',
  $$Para qual assunto você gostaria de obter informações?$$,
  NULL,
  NULL,
  NULL,
  5,
  TRUE
);

-- DSM - opções principais
SELECT upsert_navigation_node('dsm', 'Atividades Complementares (AACC)', 'dsm-aacc', NULL,
$$O curso de Desenvolvimento de Software Multiplataforma não possui Atividades Acadêmico-Científico-Culturais (AACC) previstas em sua matriz curricular.$$,
NULL,
NULL, 1, TRUE);

SELECT upsert_navigation_node('dsm', 'Datas importantes do semestre', 'dsm-datas-importantes', NULL,
$$<ul>
<li>Inscrições para vagas remanescentes e transferências: 12 a 18/01/2026</li>
<li>Rematrícula de alunos veteranos: 12 a 18/01/2026</li>
<li>Início das aulas: 09/02/2026</li>
<li>Prazo para aproveitamento de estudos (Art. 76 – via SIGA): 19/02/2026</li>
<li>Prazo para reconhecimento de competências (Art. 80, §1º): 19/02/2026</li>
<li>Ajustes de matrícula (veteranos – Art. 26, §4º): 19/02/2026</li>
<li>Exame de nivelamento com ajuste de horário (Art. 87, §1º): 21/02/2026</li>
<li>Ajustes de matrícula (ingressantes – Art. 25, §2º): 23/02/2026</li>
<li>Exame de nivelamento sem ajuste de horário: 27/02/2026</li>
<li>Cancelamento por ausência de rematrícula (Art. 28): 02/03/2026</li>
<li>Prazo final para desistência de disciplina (Art. 30): 25/03/2026</li>
<li>Prazo final para trancamento (exceto ingressantes – Art. 31, §3º): 13/05/2026</li>
<li>Término das aulas: 27/06/2026</li>
<li>Período de exames finais (Art. 34): 06 a 08/07/2026</li>
</ul>
<div>Acesse o calendário com todas as datas importantes para consultar prazos, eventos acadêmicos e períodos letivos completos.
<a href='/assets/knowledge-base/pdf/Calendario_Academico_2026.pdf' target='_blank'>Abrir Calendário Acadêmico 2026</a>.</div>
$$,
NULL,NULL, 2, TRUE);

SELECT upsert_navigation_node('dsm', 'Disciplinas com atividades de extensão', 'dsm-extensao', NULL,
$$No curso de DSM, as atividades de extensão estão vinculadas ao ABP e às seguintes disciplinas:
<div>2º semestre:</div>
<ul>
<li>Engenharia de Software II</li>
<li>Desenvolvimento Web II</li>
<li>Banco de Dados Relacional</li>
<li>Técnicas de Programação I</li>
</ul>
<div>3º semestre:</div>
<ul>
<li>Gestão Ágil de Projetos</li>
<li>Desenvolvimento Web III</li>
<li>Técnicas de Programação II</li>
<li>Interação Humano-Computador</li>
</ul>
<div>4º semestre:</div>
<ul>
<li>Laboratório de Desenvolvimento Web</li>
<li>Integração e Entrega Contínua</li>
<li>Internet das Coisas e Aplicações</li>
</ul>
<div>5º semestre:</div>
<ul>
<li>Laboratório de Desenvolvimento para Dispositivos Móveis</li>
<li>Computação em Nuvem I</li>
<li>Aprendizagem de Máquina</li>
</ul>
<div>6º semestre:</div>
<ul>
<li>Laboratório de Desenvolvimento Multiplataforma</li>
<li>Processamento de Linguagem Natural</li>
<li>Computação em Nuvem II</li>
</ul>
<div>Para obter mais orientações sobre as atividades de extensão, consulte o PPC do curso de DSM, nos anexos a partir da página 102.
<a href='/assets/knowledge-base/pdf/DSM-PPC.pdf' target='_blank'>Abrir PPC do curso</a>.</div>$$,
NULL,NULL, 3, TRUE);

SELECT upsert_navigation_node('dsm', 'Disciplinas remotas', 'dsm-disciplinas-remotas', NULL,
$$No 5º semestre:
<ul>
<li>Inglês III</li>
<li>Fundamentos da Redação Técnica</li>
</ul>
No 6º semestre:
<ul>
<li>Todas as disciplinas são remotas.</li>
</ul>
<div>As aulas são remotas e síncronas, ou seja, o aluno precisa estar presente no momento em que a aula é ministrada. Não confundir com aulas na modalidade EaD, que são remotas e assíncronas.</div>
<div>Para obter mais orientações sobre a grade de disciplinas, consulte o PPC do curso de DSM, na página 28.
<a href='/assets/knowledge-base/pdf/DSM-PPC.pdf' target='_blank'>Abrir PPC do curso</a>.</div>$$,
NULL,NULL, 4, TRUE);

SELECT upsert_navigation_node('dsm', 'Dispensa de disciplinas', 'dsm-dispensa',
$$Atenção: Não é permitido solicitar aproveitamento em disciplinas que possuam atividades de extensão curricular. No DSM as disciplinas de extensão curricular são aquelas vinculadas ao ABP. 
Escolha a modalidade desejada:$$,
NULL,
NULL,
NULL, 5, TRUE);

SELECT upsert_navigation_node('dsm', 'Estágio', 'dsm-estagio',
$$Escolha a opção:$$,
NULL,
NULL,
NULL, 6, TRUE);

SELECT upsert_navigation_node('dsm', 'Horário das aulas', 'dsm-horario-aulas',
$$Qual semestre você deseja consultar?$$,
NULL,
NULL,
NULL, 7, TRUE);

SELECT upsert_navigation_node('dsm-horario-aulas', '1º semestre', 'dsm-horario-aulas-1-semestre', NULL,
$$Horário de aulas do 1º semestre.$$,
NULL,
'assets/knowledge-base/png/horario-aula-1dsm.png', 1, TRUE);

SELECT upsert_navigation_node('dsm-horario-aulas', '2º semestre', 'dsm-horario-aulas-2-semestre', NULL,
$$Horário de aulas do 2º semestre.$$,
NULL,
'assets/knowledge-base/png/horario-aula-2dsm.png', 2, TRUE);

SELECT upsert_navigation_node('dsm-horario-aulas', '3º semestre', 'dsm-horario-aulas-3-semestre', NULL,
$$Horário de aulas do 3º semestre.$$,
NULL,
'assets/knowledge-base/png/horario-aula-3dsm.png', 3, TRUE);

SELECT upsert_navigation_node('dsm-horario-aulas', '4º semestre', 'dsm-horario-aulas-4-semestre', NULL,
$$Horário de aulas do 4º semestre.$$,
NULL,
'assets/knowledge-base/png/horario-aula-4dsm.png', 4, TRUE);

SELECT upsert_navigation_node('dsm-horario-aulas', '5º semestre', 'dsm-horario-aulas-5-semestre', NULL,
$$Horário de aulas do 5º semestre.$$,
NULL,
'assets/knowledge-base/png/horario-aula-5dsm.png', 5, TRUE);

SELECT upsert_navigation_node('dsm-horario-aulas', '6º semestre', 'dsm-horario-aulas-6-semestre', NULL,
$$Horário de aulas do 6º semestre.$$,
NULL,
'assets/knowledge-base/png/horario-aula-6dsm.png', 6, TRUE);

SELECT upsert_navigation_node('dsm', 'Portfólio', 'dsm-portfolio', NULL,
$$O curso não possui Trabalho de Graduação (TG). O TG é substituído pela construção do Portfólio Digital.
Os projetos do 4º, 5º e 6º semestres compõem o portfólio.
O portfólio deve ser hospedado em repositório privado.
Para orientações, contate: marcelo.sudo@fatec.sp.gov.br$$,
NULL,NULL, 8, TRUE);

SELECT upsert_navigation_node('dsm', 'Trabalho de Graduação (TG/TCC)', 'dsm-portfolio', NULL,
$$O curso não possui Trabalho de Graduação (TG). O TG é substituído pela construção do Portfólio Digital.
Os projetos do 4º, 5º e 6º semestres compõem o portfólio.
O portfólio deve ser hospedado em repositório privado.
Para orientações, contate: marcelo.sudo@fatec.sp.gov.br$$,
NULL,NULL, 9, TRUE);


-- DSM > Dispensa de disciplinas
SELECT upsert_navigation_node('dsm-dispensa', 'Aproveitamento de estudos – disciplina cursada em outra instituição de ensino superior', 'dsm-dispensa-aproveitamento-estudos', NULL,
$$
<div>É possível solicitar a dispensa de disciplinas cujas cargas horárias e conteúdos já tenham sido cursados em outras instituições de ensino superior.</div>
<div>A solicitação deve ser realizada pelo SIGA, anexando:</div>
<ul>
<li>Histórico escolar</li>
<li>Ementas das disciplinas cursadas</li>
</ul>
Requisitos:
<ul>
<li>Disciplinas cursadas nos últimos 10 anos</li>
<li>Similaridade ≥ 70% → aprovação direta</li>
<li>Similaridade entre 50% e 70% → exame de proficiência</li>
<li>Similaridade < 50% → indeferimento</li>
</ul>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO I - APROVEITAMENTO DE ESTUDOS</div>
<div>Artigo 75 - O aproveitamento de estudos é decorrente da equivalência entre componentes curriculares, cumpridos com aprovação em Instituição de Ensino Superior credenciada e com curso superior de graduação autorizado ou reconhecido na forma da Lei.</div>
<div>Parágrafo único - Para fins de aproveitamento de estudos, o aluno deve apresentar o histórico escolar, ementas e o programa ou plano de ensino do componentecurricular concluído nos últimos 10 (dez) anos.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 25 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL,NULL, 1, TRUE);

SELECT upsert_navigation_node('dsm-dispensa', 'Reconhecimento de competências – disciplinas cursadas na Etec', 'dsm-dispensa-reconhecimento-etec', NULL,
$$<div>É possível solicitar reconhecimento de competências adquiridas em cursos técnicos da Etec, desde que estejam previamente mapeadas no sistema acadêmico.</div>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO II - RECONHECIMENTO DE COMPETÊNCIAS</div>
<div>Artigo 79 - É possível realizar reconhecimento de competências adquiridas em cursos técnicos e profissionalizantes de unidades de ensino do CEETEPS, desde que estejam previamente mapeadas e previstas no sistema acadêmico, com especificação dos componentes curriculares passíveis de reconhecimento, valorizando, assim, saberes e conhecimentos adquiridos em outros níveis de ensino, nos termos da legislação vigente.</div>
<div>Parágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL, NULL, 2, TRUE);

SELECT upsert_navigation_node('dsm-dispensa', 'Aproveitamento de conhecimentos e experiências anteriores', 'dsm-dispensa-aproveitamento-experiencias', NULL,
$$Para solicitar, é necessário:
<ul>
<li>Diploma(s) ou certificado(s);</li>
<li>Realizar exame de proficiência.</li>
</ul>
Comprovantes aceitos:
<ul>
<li>Declaração da empresa (experiência profissional);</li>
<li>Certificados de cursos cuja soma de carga horária seja equivalente à disciplina;</li>
<li>Cursos realizados em empresas ou plataformas digitais (ex.: Coursera, Udemy);</li>
<li>Cursos de inglês para habilitação às provas de Inglês II, III e IV.</li>
</ul>
<div>A solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.</div>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO III - APROVEITAMENTO DE CONHECIMENTO E EXPERIÊNCIAS ANTERIORES</div>
<div>Artigo 83 - O aproveitamento de conhecimento e experiências anteriores pode ser utilizado para o aluno obter dispensa de disciplinas, exceto àquelas na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.</div>
<div>Parágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL, NULL, 3, TRUE);

SELECT upsert_navigation_node('dsm-dispensa', 'Proficiência em Inglês', 'dsm-dispensa-proficiencia-ingles', NULL,
$$No início do 3º semestre é aplicada a prova de proficiência em Inglês para todos os alunos.
<ul>
<li>Plataforma: NEPLE</li>
<li>Uso obrigatório de fones de ouvido</li>
<li>Aplicação exclusiva no início do 3º semestre</li>
</ul>
<div>Não é possível realizar a prova em outro período do curso.</div>
<div>A solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.</div>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO XII - EXAMES DE NIVELAMENTO E RENDIMENTO DE LÍNGUAS ESTRANGEIRAS</div>
<div>Artigo 86 - Os exames de nivelamento e rendimento de línguas estrangeiras consistem em avaliação que visa mensurar o conhecimento do aluno em línguas estrangeiras, contemplando leitura, gramática, compreensão auditiva e oralidade.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 28 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL, NULL, 4, TRUE);

-- DSM > Estágio
SELECT upsert_navigation_node('dsm-estagio', 'Duração do estágio supervisionado', 'dsm-estagio-duracao', NULL,
$$<div>Carga horária obrigatória: 240 horas.</div>
<div>Pode iniciar: a partir do 1º semestre.</div>
<div>Para obter mais orientações acesse a seção "7.1 Estágio Curricular Supervisionado" do PPC do curso de DSM, na página 93.
<a href='/assets/knowledge-base/pdf/DSM-PPC.pdf' target='_blank'>Abrir PPC do curso</a>.</div>$$,
NULL,NULL, 1, TRUE);

SELECT upsert_navigation_node('dsm-estagio', 'Início do estágio', 'dsm-estagio-inicio', NULL,
$$<div>O estágio deve ser intermediado por empresa ou agente de integração conveniado ao Centro Paula Souza.</div>
<div>Após obter a vaga, entre em contato com a Secretaria Administrativa (f258adm@cps.sp.gov.br) para solicitar orientações sobre o trâmite necessário para a assinatura do contrato de estágio.</div>$$,
NULL,NULL, 2, TRUE);

SELECT upsert_navigation_node('dsm-estagio', 'Comprovação', 'dsm-estagio-comprovacao', NULL,
$$<div>Após concluir as 240 horas de estágio, o aluno deve elaborar o Relatório Final de Estágio, que deverá ser assinado pelo supervisor e encaminhado ao Professor Orientador.</div>
<div>As orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. O modelo do Relatório Final de Estágio está no Anexo F, e o formulário de Avaliação de Estágio está no Anexo G.
<a href="/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf" target="_blank">Abrir Manual de Orientações de Estágio Supervisionado</a>.
</div>
$$,
NULL,NULL, 3, TRUE);

SELECT upsert_navigation_node('dsm-estagio', 'Equiparação de estágio', 'dsm-estagio-equiparacao', NULL,
$$<div>O estágio pode ser comprovado por meio das seguintes modalidades:</div>
<ul>
<li>Iniciação Científica;</li>
<li>Monitoria;</li>
<li>Atividade profissional na área.</li>
</ul>
<div>
As orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. Os modelos de Relatório Final de Estágio compatíveis com cada modalidade estão disponíveis nos anexos do referido manual.
<a href="/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf" target="_blank">Abrir Manual de Orientações de Estágio Supervisionado</a>.
</div>$$,
NULL,NULL, 4, TRUE);

-- Geoprocessamento - opções principais
SELECT upsert_navigation_node('geo', 'Atividades Complementares (AACC)', 'geo-aacc', NULL,
$$<div>É necessário cumprir 60 horas de Atividades Acadêmico Científico Culturais (AACC).</div>
<div>O aluno poderá utilizar cursos extracurriculares, cursos de inglês, leitura de livros, participação em feiras como a FEITEC, visitas a museus e exposições, teatro e cinema, trabalho voluntário, visitas técnicas etc.</div>
<div>Para mais detalhes acesso o PPC do curso de Geoprocessamento, na página 11.
<a href="/assets/knowledge-base/pdf/Geo-PPC.pdf" target="_blank">Abrir PPC do curso</a>.
</div>
$$,
NULL,NULL, 1, TRUE);

SELECT upsert_navigation_node('geo', 'Datas importantes do semestre', 'geo-datas-importantes', NULL,
$$<ul>
<li>Inscrições para vagas remanescentes e transferências: 12 a 18/01/2026</li>
<li>Rematrícula de alunos veteranos: 12 a 18/01/2026</li>
<li>Início das aulas: 09/02/2026</li>
<li>Prazo para aproveitamento de estudos (Art. 76 – via SIGA): 19/02/2026</li>
<li>Prazo para reconhecimento de competências (Art. 80, §1º): 19/02/2026</li>
<li>Ajustes de matrícula (veteranos – Art. 26, §4º): 19/02/2026</li>
<li>Exame de nivelamento com ajuste de horário (Art. 87, §1º): 21/02/2026</li>
<li>Ajustes de matrícula (ingressantes – Art. 25, §2º): 23/02/2026</li>
<li>Exame de nivelamento sem ajuste de horário: 27/02/2026</li>
<li>Cancelamento por ausência de rematrícula (Art. 28): 02/03/2026</li>
<li>Prazo final para desistência de disciplina (Art. 30): 25/03/2026</li>
<li>Prazo final para trancamento (exceto ingressantes – Art. 31, §3º): 13/05/2026</li>
<li>Término das aulas: 27/06/2026</li>
<li>Período de exames finais (Art. 34): 06 a 08/07/2026</li>
</ul>
<div>Acesse o calendário com todas as datas importantes para consultar prazos, eventos acadêmicos e períodos letivos completos.
<a href='/assets/knowledge-base/pdf/Calendario_Academico_2026.pdf' target='_blank'>Abrir Calendário Acadêmico 2026</a>.</div>
$$,
NULL,NULL, 2, TRUE);

SELECT upsert_navigation_node('geo', 'Disciplinas remotas', 'geo-disciplinas-remotas', NULL,
$$O curso não possui disciplinas remotas.$$,
NULL, NULL, 3, TRUE);

SELECT upsert_navigation_node('geo', 'Dispensa de disciplinas', 'geo-dispensa',
$$Atenção: Não é permitido solicitar aproveitamento em disciplinas que possuam atividades de extensão curricular.
Escolha a modalidade desejada:$$,
NULL,
NULL,
NULL, 4, TRUE);

SELECT upsert_navigation_node('geo', 'Estágio', 'geo-estagio',
$$Escolha a opção:$$,
NULL,
NULL,
NULL, 5, TRUE);

SELECT upsert_navigation_node('geo', 'Horário das aulas', 'geo-horario-aulas',
$$Qual semestre você deseja consultar?$$,
NULL,
NULL,
NULL, 6, TRUE);

SELECT upsert_navigation_node('geo-horario-aulas', '1º semestre', 'geo-horario-aulas-1-semestre', NULL,
NULL,
NULL,
'assets/knowledge-base/png/horario-aula-1geo.png', 1, TRUE);

SELECT upsert_navigation_node('geo-horario-aulas', '2º semestre', 'geo-horario-aulas-2-semestre', NULL,
NULL,
NULL,
'assets/knowledge-base/png/horario-aula-2geo.png', 2, TRUE);

SELECT upsert_navigation_node('geo-horario-aulas', '3º semestre', 'geo-horario-aulas-3-semestre', NULL,
NULL,
NULL,
'assets/knowledge-base/png/horario-aula-3geo.png', 3, TRUE);

SELECT upsert_navigation_node('geo-horario-aulas', '4º semestre', 'geo-horario-aulas-4-semestre', NULL,
$$O 4º semestre não está sendo oferecido$$,
NULL,
NULL, 4, TRUE);

SELECT upsert_navigation_node('geo-horario-aulas', '5º semestre', 'geo-horario-aulas-5-semestre', NULL,
NULL,
NULL,
'assets/knowledge-base/png/horario-aula-5geo.png', 5, TRUE);

SELECT upsert_navigation_node('geo-horario-aulas', '6º semestre', 'geo-horario-aulas-6-semestre', NULL,
$$O 6º semestre não está sendo oferecido$$,
NULL,
NULL, 6, TRUE);

SELECT upsert_navigation_node('geo', 'Portfólio', 'geo-portfolio', NULL,
$$O curso de Geoprocessamento não possui Portfólio, mas possui o Trabalho de Graduação (TG) que deverá ser iniciado no 5º semestre.$$,
$$Geoprocessamento não possui Portfólio; possui TG iniciado no 5º semestre.$$,
'PPC de Geoprocessamento - Fatec Jacareí', 7, TRUE);

SELECT upsert_navigation_node('geo', 'Trabalho de Graduação (TG/TCC)', 'geo-portfolio', NULL,
$$<div>O Trabalho de Graduação (TG) deve ser iniciado no 5º semestre, na disciplina Projetos em Geoprocessamento I, e concluído no 6º semestre, na disciplina Projetos em Geoprocessamento II.</div>
<div>Para iniciar o TG, o aluno deve contar com um professor orientador. Cabe ao aluno procurar um dos professores que possam atuar como orientador e discutir o tema a ser desenvolvido. O aluno pode ter um coorientador externo (fora da Fatec Jacareí).</div>
<div>O TG deve ser elaborado no formato de artigo científico e apresentado perante uma banca examinadora composta por, no mínimo, três professores.</div>
<div>O aluno poderá ser dispensado da redação do TG caso apresente artigo científico já publicado em revista ou simpósio, desde que figure como primeiro autor. Nessa situação, deverá apenas realizar a defesa do trabalho perante a banca de professores da Fatec.</div>
$$,
NULL,NULL, 8, TRUE);

-- Geo > Dispensa de disciplinas
SELECT upsert_navigation_node('geo-dispensa', 'Aproveitamento de estudos – disciplina cursada em outra instituição de ensino superior', 'geo-dispensa-aproveitamento-estudos', NULL,
$$
<div>É possível solicitar a dispensa de disciplinas cujas cargas horárias e conteúdos já tenham sido cursados em outras instituições de ensino superior.</div>
<div>A solicitação deve ser realizada pelo SIGA, anexando:</div>
<ul>
<li>Histórico escolar</li>
<li>Ementas das disciplinas cursadas</li>
</ul>
Requisitos:
<ul>
<li>Disciplinas cursadas nos últimos 10 anos</li>
<li>Similaridade ≥ 70% → aprovação direta</li>
<li>Similaridade entre 50% e 70% → exame de proficiência</li>
<li>Similaridade < 50% → indeferimento</li>
</ul>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO I - APROVEITAMENTO DE ESTUDOS</div>
<div>Artigo 75 - O aproveitamento de estudos é decorrente da equivalência entre componentes curriculares, cumpridos com aprovação em Instituição de Ensino Superior credenciada e com curso superior de graduação autorizado ou reconhecido na forma da Lei.</div>
<div>Parágrafo único - Para fins de aproveitamento de estudos, o aluno deve apresentar o histórico escolar, ementas e o programa ou plano de ensino do componentecurricular concluído nos últimos 10 (dez) anos.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 25 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL,NULL, 1, TRUE);

SELECT upsert_navigation_node('geo-dispensa', 'Reconhecimento de competências – disciplinas cursadas na Etec', 'geo-dispensa-reconhecimento-etec', NULL,
$$<div>É possível solicitar reconhecimento de competências adquiridas em cursos técnicos da Etec, desde que estejam previamente mapeadas no sistema acadêmico.</div>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO II - RECONHECIMENTO DE COMPETÊNCIAS</div>
<div>Artigo 79 - É possível realizar reconhecimento de competências adquiridas em cursos técnicos e profissionalizantes de unidades de ensino do CEETEPS, desde que estejam previamente mapeadas e previstas no sistema acadêmico, com especificação dos componentes curriculares passíveis de reconhecimento, valorizando, assim, saberes e conhecimentos adquiridos em outros níveis de ensino, nos termos da legislação vigente.</div>
<div>Parágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL, NULL, 2, TRUE);

SELECT upsert_navigation_node('geo-dispensa', 'Aproveitamento de conhecimentos e experiências anteriores', 'geo-dispensa-aproveitamento-experiencias', NULL,
$$Para solicitar, é necessário:
<ul>
<li>Diploma(s) ou certificado(s);</li>
<li>Realizar exame de proficiência.</li>
</ul>
Comprovantes aceitos:
<ul>
<li>Declaração da empresa (experiência profissional);</li>
<li>Certificados de cursos cuja soma de carga horária seja equivalente à disciplina;</li>
<li>Cursos realizados em empresas ou plataformas digitais (ex.: Coursera, Udemy);</li>
<li>Cursos de inglês para habilitação às provas de Inglês II, III, IV, V e VI.</li>
</ul>
<div>A solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.</div>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO III - APROVEITAMENTO DE CONHECIMENTO E EXPERIÊNCIAS ANTERIORES</div>
<div>Artigo 83 - O aproveitamento de conhecimento e experiências anteriores pode ser utilizado para o aluno obter dispensa de disciplinas, exceto àquelas na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.</div>
<div>Parágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL, NULL, 3, TRUE);

SELECT upsert_navigation_node('geo-dispensa', 'Proficiência em Inglês', 'geo-dispensa-proficiencia-ingles', NULL,
$$No início do 1º semestre é aplicada a prova de proficiência em Inglês para todos os alunos.
<ul>
<li>Plataforma: NEPLE</li>
<li>Uso obrigatório de fones de ouvido</li>
<li>Aplicação exclusiva no início do 1º semestre</li>
</ul>
<div>Não é possível realizar a prova em outro período do curso.</div>
<div>A solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.</div>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO XII - EXAMES DE NIVELAMENTO E RENDIMENTO DE LÍNGUAS ESTRANGEIRAS</div>
<div>Artigo 86 - Os exames de nivelamento e rendimento de línguas estrangeiras consistem em avaliação que visa mensurar o conhecimento do aluno em línguas estrangeiras, contemplando leitura, gramática, compreensão auditiva e oralidade.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 28 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL, NULL, 4, TRUE);

-- Geo > Estágio
SELECT upsert_navigation_node('geo-estagio', 'Duração do estágio supervisionado', 'geo-estagio-duracao', NULL,
$$<div>Carga horária obrigatória: 180 horas.</div>
<div>Pode iniciar: a partir do 4º semestre.</div>
<div>Para obter mais orientações acesse a seção "12.1 Estágio" do PPC do curso de Geoprocessameto, na página 40.
<a href='/assets/knowledge-base/pdf/Geo-PPC.pdf' target='_blank'>Abrir PPC do curso</a>.</div>$$,
NULL,NULL, 1, TRUE);

SELECT upsert_navigation_node('geo-estagio', 'Início do estágio', 'geo-estagio-inicio', NULL,
$$<div>O estágio deve ser intermediado por empresa ou agente de integração conveniado ao Centro Paula Souza.</div>
<div>Após obter a vaga, entre em contato com a Secretaria Administrativa (f258adm@cps.sp.gov.br) para solicitar orientações sobre o trâmite necessário para a assinatura do contrato de estágio.</div>$$,
NULL,NULL, 2, TRUE);

SELECT upsert_navigation_node('geo-estagio', 'Comprovação', 'geo-estagio-comprovacao', NULL,
$$<div>Após concluir as 180 horas de estágio, o aluno deve elaborar o Relatório Final de Estágio, que deverá ser assinado pelo supervisor e encaminhado ao Professor Orientador.</div>
<div>As orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. O modelo do Relatório Final de Estágio está no Anexo F, e o formulário de Avaliação de Estágio está no Anexo G.
<a href="/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf" target="_blank">Abrir Manual de Orientações de Estágio Supervisionado</a>.
</div>
$$,
NULL,NULL, 3, TRUE);

SELECT upsert_navigation_node('geo-estagio', 'Equiparação de estágio', 'geo-estagio-equiparacao', NULL,
$$<div>O estágio pode ser comprovado por meio das seguintes modalidades:</div>
<ul>
<li>Iniciação Científica;</li>
<li>Monitoria;</li>
<li>Atividade profissional na área.</li>
</ul>
<div>
As orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. Os modelos de Relatório Final de Estágio compatíveis com cada modalidade estão disponíveis nos anexos do referido manual.
<a href="/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf" target="_blank">Abrir Manual de Orientações de Estágio Supervisionado</a>.
</div>$$,
NULL,NULL, 4, TRUE);

-- MARH - opções principais
SELECT upsert_navigation_node('marh', 'Atividades Complementares (AACC)', 'marh-aacc', NULL,
$$<div>É necessário cumprir 60 horas de Atividades Acadêmico Científico Culturais (AACC).</div>
<div>O aluno poderá utilizar cursos extracurriculares, cursos de inglês, leitura de livros, participação em feiras como a FEITEC, visitas a museus e exposições, teatro e cinema, trabalho voluntário, visitas técnicas etc.</div>
<div>Para mais detalhes acesso o PPC do curso de MARH, na página 11.
<a href="/assets/knowledge-base/pdf/MARH-PPC.pdf" target="_blank">Abrir PPC do curso</a>.
</div>
$$,
NULL,NULL, 1, TRUE);

SELECT upsert_navigation_node('marh', 'Datas importantes do semestre', 'marh-datas-importantes', NULL,
$$<ul>
<li>Inscrições para vagas remanescentes e transferências: 12 a 18/01/2026</li>
<li>Rematrícula de alunos veteranos: 12 a 18/01/2026</li>
<li>Início das aulas: 09/02/2026</li>
<li>Prazo para aproveitamento de estudos (Art. 76 – via SIGA): 19/02/2026</li>
<li>Prazo para reconhecimento de competências (Art. 80, §1º): 19/02/2026</li>
<li>Ajustes de matrícula (veteranos – Art. 26, §4º): 19/02/2026</li>
<li>Exame de nivelamento com ajuste de horário (Art. 87, §1º): 21/02/2026</li>
<li>Ajustes de matrícula (ingressantes – Art. 25, §2º): 23/02/2026</li>
<li>Exame de nivelamento sem ajuste de horário: 27/02/2026</li>
<li>Cancelamento por ausência de rematrícula (Art. 28): 02/03/2026</li>
<li>Prazo final para desistência de disciplina (Art. 30): 25/03/2026</li>
<li>Prazo final para trancamento (exceto ingressantes – Art. 31, §3º): 13/05/2026</li>
<li>Término das aulas: 27/06/2026</li>
<li>Período de exames finais (Art. 34): 06 a 08/07/2026</li>
</ul>
<div>Acesse o calendário com todas as datas importantes para consultar prazos, eventos acadêmicos e períodos letivos completos.
<a href='/assets/knowledge-base/pdf/Calendario_Academico_2026.pdf' target='_blank'>Abrir Calendário Acadêmico 2026</a>.</div>
$$,
NULL,NULL, 2, TRUE);

SELECT upsert_navigation_node('marh', 'Disciplinas remotas', 'marh-disciplinas-remotas', NULL,
$$No 5º semestre:
<ul><li>20% da carga horária de cada disciplina é remota</li></ul>
No 6º semestre:
<ul><li>Todas as disciplinas são remotas.</li></ul>
<div>As aulas são remotas e síncronas, ou seja, o aluno precisa estar presente no momento em que a aula é ministrada. Não confundir com aulas na modalidade EaD, que são remotas e assíncronas.</div>
<div>Para obter mais orientações sobre a grade de disciplinas, consulte o PPC do curso de MARH, na página 24.
<a href='/assets/knowledge-base/pdf/MARH-PPC.pdf' target='_blank'>Abrir PPC do curso</a>.</div>$$,
NULL,NULL, 3, TRUE);

SELECT upsert_navigation_node('marh', 'Dispensa de disciplinas', 'marh-dispensa',
$$Atenção: Não é permitido solicitar aproveitamento em disciplinas que possuam atividades de extensão curricular.
Escolha a modalidade desejada:$$,
NULL,
NULL,
NULL, 4, TRUE);

SELECT upsert_navigation_node('marh', 'Estágio', 'marh-estagio',
$$Escolha a opção:$$,
NULL,
NULL,
NULL, 5, TRUE);

SELECT upsert_navigation_node('marh', 'Horário das aulas', 'marh-horario-aulas',
$$Qual semestre você deseja consultar?$$,
NULL,
NULL,
NULL, 6, TRUE);

SELECT upsert_navigation_node('marh-horario-aulas', '1º semestre', 'marh-horario-aulas-1-semestre', NULL,
NULL,
NULL,
'assets/knowledge-base/png/horario-aula-1marh.png', 1, TRUE);

SELECT upsert_navigation_node('marh-horario-aulas', '2º semestre', 'marh-horario-aulas-2-semestre', NULL,
NULL,
NULL,
'assets/knowledge-base/png/horario-aula-2marh.png', 2, TRUE);

SELECT upsert_navigation_node('marh-horario-aulas', '3º semestre', 'marh-horario-aulas-3-semestre', NULL,
NULL,
NULL,
'assets/knowledge-base/png/horario-aula-3marh.png', 3, TRUE);

SELECT upsert_navigation_node('marh-horario-aulas', '4º semestre', 'marh-horario-aulas-4-semestre', NULL,
NULL,
NULL,
'assets/knowledge-base/png/horario-aula-4marh.png', 4, TRUE);

SELECT upsert_navigation_node('marh-horario-aulas', '5º semestre', 'marh-horario-aulas-5-semestre', NULL,
NULL,
NULL,
'assets/knowledge-base/png/horario-aula-5marh.png', 5, TRUE);

SELECT upsert_navigation_node('marh-horario-aulas', '6º semestre', 'marh-horario-aulas-6-semestre', NULL,
$$O 6º semestre não está sendo oferecido$$,
NULL,
NULL, 6, TRUE);

SELECT upsert_navigation_node('marh', 'Portfólio', 'marh-portfolio', NULL,
$$O curso de Meio Ambiente e Recursos Hídricos não possui Portfólio, mas possui o Trabalho de Graduação (TG) que deverá ser iniciado no 5º semestre.$$,
$$MARH não possui Portfólio; possui TG iniciado no 5º semestre.$$,
'PPC de MARH - Fatec Jacareí', 7, TRUE);

SELECT upsert_navigation_node('marh', 'Trabalho de Graduação (TG/TCC)', 'marh-portfolio', NULL,
$$<div>O Trabalho de Graduação (TG) deve ser iniciado no 5º semestre, na disciplina Projetos Ambientais I, e concluído no 6º semestre, na disciplina Projetos Ambientais II.</div>
<div>Para iniciar o TG, o aluno deve contar com um professor orientador. Cabe ao aluno procurar um dos professores que possam atuar como orientador e discutir o tema a ser desenvolvido. O aluno pode ter um coorientador externo (fora da Fatec Jacareí).</div>
<div>O TG deve ser elaborado no formato de artigo científico e apresentado perante uma banca examinadora composta por, no mínimo, três professores.</div>
<div>O aluno poderá ser dispensado da redação do TG caso apresente artigo científico já publicado em revista ou simpósio, desde que figure como primeiro autor. Nessa situação, deverá apenas realizar a defesa do trabalho perante a banca de professores da Fatec.</div>
$$,
NULL,NULL, 8, TRUE);

-- MARH > Dispensa de disciplinas
SELECT upsert_navigation_node('marh-dispensa', 'Aproveitamento de estudos – disciplina cursada em outra instituição de ensino superior', 'marh-dispensa-aproveitamento-estudos', NULL,
$$
<div>É possível solicitar a dispensa de disciplinas cujas cargas horárias e conteúdos já tenham sido cursados em outras instituições de ensino superior.</div>
<div>A solicitação deve ser realizada pelo SIGA, anexando:</div>
<ul>
<li>Histórico escolar</li>
<li>Ementas das disciplinas cursadas</li>
</ul>
Requisitos:
<ul>
<li>Disciplinas cursadas nos últimos 10 anos</li>
<li>Similaridade ≥ 70% → aprovação direta</li>
<li>Similaridade entre 50% e 70% → exame de proficiência</li>
<li>Similaridade < 50% → indeferimento</li>
</ul>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO I - APROVEITAMENTO DE ESTUDOS</div>
<div>Artigo 75 - O aproveitamento de estudos é decorrente da equivalência entre componentes curriculares, cumpridos com aprovação em Instituição de Ensino Superior credenciada e com curso superior de graduação autorizado ou reconhecido na forma da Lei.</div>
<div>Parágrafo único - Para fins de aproveitamento de estudos, o aluno deve apresentar o histórico escolar, ementas e o programa ou plano de ensino do componentecurricular concluído nos últimos 10 (dez) anos.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 25 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL,NULL, 1, TRUE);

SELECT upsert_navigation_node('marh-dispensa', 'Reconhecimento de competências – disciplinas cursadas na Etec', 'marh-dispensa-reconhecimento-etec', NULL,
$$<div>É possível solicitar reconhecimento de competências adquiridas em cursos técnicos da Etec, desde que estejam previamente mapeadas no sistema acadêmico.</div>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO II - RECONHECIMENTO DE COMPETÊNCIAS</div>
<div>Artigo 79 - É possível realizar reconhecimento de competências adquiridas em cursos técnicos e profissionalizantes de unidades de ensino do CEETEPS, desde que estejam previamente mapeadas e previstas no sistema acadêmico, com especificação dos componentes curriculares passíveis de reconhecimento, valorizando, assim, saberes e conhecimentos adquiridos em outros níveis de ensino, nos termos da legislação vigente.</div>
<div>Parágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL, NULL, 2, TRUE);

SELECT upsert_navigation_node('marh-dispensa', 'Aproveitamento de conhecimentos e experiências anteriores', 'marh-dispensa-aproveitamento-experiencias', NULL,
$$Para solicitar, é necessário:
<ul>
<li>Diploma(s) ou certificado(s);</li>
<li>Realizar exame de proficiência.</li>
</ul>
Comprovantes aceitos:
<ul>
<li>Declaração da empresa (experiência profissional);</li>
<li>Certificados de cursos cuja soma de carga horária seja equivalente à disciplina;</li>
<li>Cursos realizados em empresas ou plataformas digitais (ex.: Coursera, Udemy);</li>
<li>Cursos de inglês para habilitação às provas de Inglês II, III e IV.</li>
</ul>
<div>A solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.</div>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO III - APROVEITAMENTO DE CONHECIMENTO E EXPERIÊNCIAS ANTERIORES</div>
<div>Artigo 83 - O aproveitamento de conhecimento e experiências anteriores pode ser utilizado para o aluno obter dispensa de disciplinas, exceto àquelas na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.</div>
<div>Parágrafo único - Fica vedado o reconhecimento de competências em disciplina(s) na(s) qual(is) seja(m) prevista(s) atividade(s) de extensão curricularizadas.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 27 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL, NULL, 3, TRUE);

SELECT upsert_navigation_node('marh-dispensa', 'Proficiência em Inglês', 'marh-dispensa-proficiencia-ingles', NULL,
$$No início do 1º semestre é aplicada a prova de proficiência em Inglês para todos os alunos.
<ul>
<li>Plataforma: NEPLE</li>
<li>Uso obrigatório de fones de ouvido</li>
<li>Aplicação exclusiva no início do 1º semestre</li>
</ul>
<div>Não é possível realizar a prova em outro período do curso.</div>
<div>A solicitação deve ser formalizada por e-mail à Secretaria Acadêmica, informando o nome da disciplina e anexando os documentos.</div>
<div>Regulamento Geral dos Cursos Superiores das Fatecs</div>
<div>SEÇÃO XII - EXAMES DE NIVELAMENTO E RENDIMENTO DE LÍNGUAS ESTRANGEIRAS</div>
<div>Artigo 86 - Os exames de nivelamento e rendimento de línguas estrangeiras consistem em avaliação que visa mensurar o conhecimento do aluno em línguas estrangeiras, contemplando leitura, gramática, compreensão auditiva e oralidade.</div>
<div>Para obter a descrição completa acessa o restante do texto na página 28 do Regulamento Geral dos Cursos Superiores das Fatecs. 
<a href='/assets/knowledge-base/pdf/Regulamento_Geral_dos_Cursos.pdf' target='_blank'>Abrir Regulamento Geral</a>.</div>
$$,
NULL, NULL, 4, TRUE);

-- MARH > Estágio
SELECT upsert_navigation_node('marh-estagio', 'Duração do estágio supervisionado', 'marh-estagio-duracao', NULL,
$$<div>Carga horária obrigatória: 180 horas.</div>
<div>Pode iniciar: a partir do 4º semestre.</div>
<div>Para obter mais orientações acesse a seção "7.2 Estágio Curricular Supervisionado" do PPC do curso de MARH, na página 89.
<a href='/assets/knowledge-base/pdf/MARH-PPC.pdf' target='_blank'>Abrir PPC do curso</a>.</div>$$,
NULL,NULL, 1, TRUE);

SELECT upsert_navigation_node('marh-estagio', 'Início do estágio', 'marh-estagio-inicio', NULL,
$$<div>O estágio deve ser intermediado por empresa ou agente de integração conveniado ao Centro Paula Souza.</div>
<div>Após obter a vaga, entre em contato com a Secretaria Administrativa (f258adm@cps.sp.gov.br) para solicitar orientações sobre o trâmite necessário para a assinatura do contrato de estágio.</div>$$,
NULL,NULL, 2, TRUE);

SELECT upsert_navigation_node('marh-estagio', 'Comprovação', 'marh-estagio-comprovacao', NULL,
$$<div>Após concluir as 180 horas de estágio, o aluno deve elaborar o Relatório Final de Estágio, que deverá ser assinado pelo supervisor e encaminhado ao Professor Orientador.</div>
<div>As orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. O modelo do Relatório Final de Estágio está no Anexo F, e o formulário de Avaliação de Estágio está no Anexo G.
<a href="/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf" target="_blank">Abrir Manual de Orientações de Estágio Supervisionado</a>.
</div>
$$,
NULL,NULL, 3, TRUE);

SELECT upsert_navigation_node('marh-estagio', 'Equiparação de estágio', 'marh-estagio-equiparacao', NULL,
$$<div>O estágio pode ser comprovado por meio das seguintes modalidades:</div>
<ul>
<li>Iniciação Científica;</li>
<li>Monitoria;</li>
<li>Atividade profissional na área.</li>
</ul>
<div>
As orientações sobre os documentos a serem apresentados constam no Manual de Orientações de Estágio Supervisionado. Os modelos de Relatório Final de Estágio compatíveis com cada modalidade estão disponíveis nos anexos do referido manual.
<a href="/assets/knowledge-base/pdf/Manual_de_orientacoes_de_Estagio_Supervisionado.pdf" target="_blank">Abrir Manual de Orientações de Estágio Supervisionado</a>.
</div>$$,
NULL,NULL, 4, TRUE);

-- Não sou aluno
SELECT upsert_navigation_node('nao-sou-aluno', 'A Fatec possui cursos técnicos?', 'nao-aluno-cursos-tecnicos', NULL,
$$A Fatec oferece exclusivamente cursos de graduação tecnológica (ensino superior). Caso você esteja interessado em cursos técnicos de nível médio, recomendamos acessar o site da Etec Jacareí:
<a href='https://vestibulinho.etec.sp.gov.br/unidades-cursos/escola.asp?c=77' target='_blank'>https://vestibulinho.etec.sp.gov.br/unidades-cursos/escola.asp?c=77</a>$$,
NULL,
NULL, 1, TRUE);

SELECT upsert_navigation_node('nao-sou-aluno', 'Como ingressar na Fatec?', 'nao-aluno-ingresso', NULL,
$$O ingresso na Fatec ocorre por meio de vestibular. O processo seletivo é realizado duas vezes ao ano, com ingressos previstos para os meses de fevereiro e agosto.
<div>Para obter informações detalhadas sobre inscrições e datas, acesse o portal oficial do vestibular:
<a href='https://vestibular.fatec.sp.gov.br/home' target='_blank'>https://vestibular.fatec.sp.gov.br/home</a>.</div>$$,
NULL,
NULL, 2, TRUE);

SELECT upsert_navigation_node('nao-sou-aluno', 'Como realizar a matrícula?', 'nao-aluno-matricula', NULL,
$$A matrícula dos candidatos aprovados no vestibular é realizada de forma totalmente online, por meio do portal oficial do vestibular, dentro do prazo estabelecido no calendário do processo seletivo.
<div>Para obter mais informações acesse o portal oficial do vestibular:
<a href='https://vestibular.fatec.sp.gov.br/duvidas-frequentes' target='_blank'>https://vestibular.fatec.sp.gov.br/duvidas-frequentes</a>.</div>$$,
NULL,
NULL, 3, TRUE);

SELECT upsert_navigation_node('nao-sou-aluno', 'Cursos oferecidos na Fatec Jacareí', 'nao-aluno-cursos-oferecidos', NULL,
$$A Fatec Jacareí oferece os seguintes cursos de graduação tecnológica:
<ul>
<li>Desenvolvimento de Software Multiplataforma</li>
<li>Geoprocessamento</li>
<li>Meio Ambiente e Recursos Hídricos</li>
</ul>
<div>Todos os cursos são oferecidos no período noturno, das 18h45 às 23h05, e possuem 3 anos de duração (6 semestres).</div>
<div>Para mais informações acesse a página da Fatec Jacareí <a href='https://fatecjacarei.cps.sp.gov.br' target='_blank'>https://fatecjacarei.cps.sp.gov.br</a>.</div>$$,
NULL,
NULL, 4, TRUE);

SELECT upsert_navigation_node('nao-sou-aluno', 'Horários das aulas', 'nao-aluno-horarios-aulas', NULL,
$$As aulas de todos os cursos da Fatec Jacareí ocorrem no período noturno, das 18h45 às 23h05.$$,
NULL,
NULL, 5, TRUE);

DROP FUNCTION upsert_navigation_node(VARCHAR, VARCHAR, VARCHAR, TEXT, TEXT, TEXT, VARCHAR, INTEGER, BOOLEAN);

-- Dispensa de disciplinas: somente submenu com 4 opções (sem respostas)
UPDATE navigation_nodes
SET is_active = FALSE,
    updated_at = NOW()
WHERE slug IN (
    'dsm-dispensa-extensao',
    'geo-dispensa-extensao',
    'marh-dispensa-extensao'
  );
