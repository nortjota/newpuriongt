import { FileText } from "lucide-react";
import LegalLayout from "@/components/legal/LegalLayout";
import { COMPANY } from "@/lib/config/company";

export default function TermsPage() {
  return (
    <LegalLayout
      icon={FileText}
      eyebrow="Institucional"
      title="Termos de Uso"
      updatedAt="14 de outubro de 2026"
      intro={
        <p>
          Estes Termos de Uso regem o acesso e o uso do site puriongt.com.br e a compra dos produtos PURION GT,
          operado por {COMPANY.razaoSocial}, inscrita no CNPJ sob o nº {COMPANY.cnpj}, com sede em{" "}
          {COMPANY.endereco}. Ao usar o site ou fazer um pedido, você concorda com estas condições. Leia também
          nossa <a href="/privacy">Política de Privacidade</a>, que explica como tratamos seus dados.
        </p>
      }
      sections={[
        {
          id: "condicoes-gerais",
          title: "Condições gerais",
          content: (
            <p>
              Para comprar em nosso site, você precisa ser maior de 18 anos ou estar acompanhado de um responsável
              legal. Reservamos o direito de recusar atendimento a qualquer pessoa, a qualquer momento, por motivo
              legítimo (por exemplo, suspeita de fraude).
            </p>
          ),
        },
        {
          id: "produtos-precos",
          title: "Produtos, preços e disponibilidade",
          content: (
            <p>
              Fazemos o possível para manter as informações de produto, preço e estoque atualizadas, mas erros
              podem acontecer. Reservamos o direito de corrigir preços incorretos, limitar quantidades por pedido e
              descontinuar qualquer produto ou promoção sem aviso prévio. Cores e detalhes do frasco podem variar
              ligeiramente em relação às fotos do site, por limitações de exibição em tela.
            </p>
          ),
        },
        {
          id: "pedidos-pagamento",
          title: "Pedidos e pagamento",
          content: (
            <p>
              O pagamento é processado por um parceiro externo de checkout. Ao finalizar a compra, você confirma
              que as informações fornecidas (dados pessoais e de pagamento) são verdadeiras e atuais. Podemos
              cancelar ou limitar pedidos que pareçam fraudulentos ou feitos de má-fé.
            </p>
          ),
        },
        {
          id: "entrega",
          title: "Entrega",
          content: (
            <p>
              Trabalhamos para enviar seu pedido no mesmo dia da aprovação do pagamento, com código de rastreio
              enviado por e-mail ou WhatsApp. Prazos de entrega podem variar de acordo com a transportadora e a sua
              região.
            </p>
          ),
        },
        {
          id: "arrependimento",
          title: "Direito de arrependimento e garantia de 7 dias",
          content: (
            <p>
              Conforme o Código de Defesa do Consumidor (Art. 49), você tem até 7 dias corridos após o recebimento
              do produto para desistir da compra, sem precisar justificar o motivo, com devolução integral do valor
              pago. Para exercer esse direito, fale com a gente pelo WhatsApp ou por{" "}
              <a href="mailto:puriongt@gmail.com">puriongt@gmail.com</a>.
            </p>
          ),
        },
        {
          id: "assinatura",
          title: "Assinatura (recorrência)",
          content: (
            <p>
              Se você escolher o plano de assinatura, seu frasco é enviado automaticamente a cada 60 dias com o
              desconto vigente. Cancele quando quiser pelo WhatsApp.
            </p>
          ),
        },
        {
          id: "depoimentos",
          title: "Depoimentos e comentários",
          content: (
            <p>
              Ao enviar um depoimento pelo site, você garante que o conteúdo é verdadeiro e autoriza a PURION GT a
              exibi-lo publicamente na página de avaliações. Podemos remover comentários ofensivos, falsos ou que
              violem direitos de terceiros.
            </p>
          ),
        },
        {
          id: "links-terceiros",
          title: "Links e ferramentas de terceiros",
          content: (
            <p>
              O site pode conter links para o WhatsApp, Instagram e outras plataformas de terceiros. Não somos
              responsáveis pelo conteúdo, pelas políticas de privacidade ou pelas práticas desses serviços externos.
            </p>
          ),
        },
        {
          id: "usos-proibidos",
          title: "Usos proibidos",
          content: (
            <>
              <p>É proibido usar o site para:</p>
              <ul>
                <li>Qualquer finalidade ilegal ou que viole leis brasileiras;</li>
                <li>Transmitir vírus, malware ou qualquer código malicioso;</li>
                <li>Coletar dados pessoais de outros usuários sem autorização;</li>
                <li>Interferir na segurança ou no funcionamento do site.</li>
              </ul>
            </>
          ),
        },
        {
          id: "limitacao",
          title: "Limitação de responsabilidade",
          content: (
            <p>
              O site é fornecido &ldquo;como está&rdquo;. Na medida permitida pela lei, não nos responsabilizamos
              por danos indiretos decorrentes do uso do site ou dos produtos, exceto nos casos em que a legislação
              de consumo brasileira estabeleça responsabilidade diversa.
            </p>
          ),
        },
        {
          id: "alteracoes",
          title: "Alterações destes termos",
          content: (
            <p>
              Podemos atualizar estes Termos de Uso a qualquer momento. A versão vigente é sempre a publicada nesta
              página, com a data da última atualização no topo.
            </p>
          ),
        },
        {
          id: "legislacao",
          title: "Legislação aplicável",
          content: (
            <p>
              Estes termos são regidos pelas leis brasileiras, incluindo o Código de Defesa do Consumidor e a Lei
              Geral de Proteção de Dados.
            </p>
          ),
        },
        {
          id: "contato",
          title: "Contato",
          content: (
            <p>
              Dúvidas sobre estes termos? Fale com a gente em <a href="mailto:puriongt@gmail.com">puriongt@gmail.com</a>{" "}
              ou pelo WhatsApp.
            </p>
          ),
        },
      ]}
    />
  );
}
