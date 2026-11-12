// Ids/âncoras da /presentes. Módulo neutro (sem "use client") para poder ser
// importado tanto por componentes de servidor quanto de cliente — constantes
// exportadas de um módulo "use client" viram referências de cliente no
// servidor e quebram os hrefs.
export const CHOOSER_ID = "escolher-presente";
export const EXPERIENCE_ID = "experiencia-presente";
export const OCCASION_PARAM = "ocasiao";
