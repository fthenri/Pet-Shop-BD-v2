USE PetShop;
 
-- ENTREGÁVEL 1: NOVOS ÍNDICES 

-- Justificativa 1: Este índice é crucial para otimizar a junção (JOIN) 
-- entre 'Consulta_Atende' e 'Veterinario' (que depois se junta com 'Funcionario')
-- Ele será usado diretamente pela 'VW_DetalhesConsulta' que criamos abaixo,
-- acelerando a busca por consultas de um veterinário específico.

CREATE INDEX IDX_Consulta_cod_funcionario
ON Consulta_Atende(cod_funcionario);

-- * Justificativa 2: Este índice acelera a busca de todos os exames
-- associados a uma 'num_consulta' específica. É uma otimização
-- muito comum para qualquer consulta que busque "o que aconteceu
-- nesta consulta?" (como relatórios de histórico do pet).

CREATE INDEX IDX_Exame_num_consulta
ON Exame(num_consulta);