import LegalLayout from "@/components/legal/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Termos de Uso" updatedAt="14 de outubro de 2026">
      <section>
        <p>
          Estes Termos de Uso regem o acesso e o uso do site puriongt.com.br e a compra dos produtos PURION GT. Ao
          usar o site ou fazer um pedido, você concorda com estas condições. Leia também nossa{" "}
          <a href="/privacy" className="underline">
            Política de Privacidade
          </a>
          , que explica como tratamos seus dados.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">1. Condições gerais</h2>
        <p className="mt-3">
          Para comprar em nosso site, você precisa ser maior de 18 anos ou estar acompanhado de um responsável
          legal. Reservamos o direito de recusar atendimento a qualquer pessoa, a qualquer momento, por motivo
          legítimo (por exemplo, suspeita de fraude).
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">2. Produtos, preços e disponibilidade</h2>
        <p className="mt-3">
          Fazemos o possível para manter as informações de produto, preço e estoque atualizadas, mas erros podem
          acontecer. Reservamos o direito de corrigir preços incorretos, limitar quantidades por pedido e
          descontinuar qualquer produto ou promoção sem aviso prévio. Cores e detalhes do frasco podem variar
          ligeiramente em relação às fotos do site, por limitações de exibição em tela.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">3. Pedidos e pagamento</h2>
        <p className="mt-3">
          O pagamento é processado por um parceiro externo de checkout. Ao finalizar a compra, você confirma que as
          informações fornecidas (dados pessoais e de pagamento) são verdadeiras e atuais. Podemos cancelar ou
          limitar pedidos que pareçam fraudulentos ou feitos de má-fé.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">4. Entrega</h2>
        <p className="mt-3">
          Trabalhamos para enviar seu pedido no mesmo dia da aprovação do pagamento, com código de rastreio enviado
          por e-mail ou WhatsApp. Prazos de entrega podem variar de acordo com a transportadora e a sua região.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">
          5. Direito de arrependimento e garantia de 7 dias
        </h2>
        <p className="mt-3">
          Conforme o Código de Defesa do Consumidor (Art. 49), você tem até 7 dias corridos após o recebimento do
          produto para desistir da compra, sem precisar justificar o motivo, com devolução integral do valor pago.
          Para exercer esse direito, fale com a gente pelo WhatsApp ou por{" "}
          <a href="mailto:contato@puriongt.com.br" className="underline">
            contato@puriongt.com.br
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">6. Assinatura (recorrência)</h2>
        <p className="mt-3">
          Se você escolher o plano de assinatura, seu frasco é enviado automaticamente na frequência selecionada
          (30, 60 ou 90 dias) com o desconto vigente. Você pode pausar ou cancelar a assinatura quando quiser, falando
          com a gente pelo WhatsApp.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">7. Depoimentos e comentários</h2>
        <p className="mt-3">
          Ao enviar um depoimento pelo site, você garante que o conteúdo é verdadeiro e autoriza a PURION GT a
          exibi-lo publicamente na página de avaliações. Podemos remover comentários ofensivos, falsos ou que violem
          direitos de terceiros.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">8. Links e ferramentas de terceiros</h2>
        <p className="mt-3">
          O site pode conter links para o WhatsApp, Instagram e outras plataformas de terceiros. Não somos
          responsáveis pelo conteúdo, pelas políticas de privacidade ou pelas práticas desses serviços externos.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">9. Usos proibidos</h2>
        <p className="mt-3">É proibido usar o site para:</p>
        <ul className="mt-3 flex flex-col gap-2 pl-5 list-disc">
          <li>Qualquer finalidade ilegal ou que viole leis brasileiras;</li>
          <li>Transmitir vírus, malware ou qualquer código malicioso;</li>
          <li>Coletar dados pessoais de outros usuários sem autorização;</li>
          <li>Interferir na segurança ou no funcionamento do site.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">10. Limitação de responsabilidade</h2>
        <p className="mt-3">
          O site é fornecido &ldquo;como está&rdquo;. Na medida permitida pela lei, não nos responsabilizamos por
          danos indiretos decorrentes do uso do site ou dos produtos, exceto nos casos em que a legislação de
          consumo brasileira estabeleça responsabilidade diversa.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">11. Alterações destes termos</h2>
        <p className="mt-3">
          Podemos atualizar estes Termos de Uso a qualquer momento. A versão vigente é sempre a publicada nesta
          página, com a data da última atualização no topo.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">12. Legislação aplicável</h2>
        <p className="mt-3">
          Estes termos são regidos pelas leis brasileiras, incluindo o Código de Defesa do Consumidor e a Lei Geral
          de Proteção de Dados.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">13. Contato</h2>
        <p className="mt-3">
          Dúvidas sobre estes termos? Fale com a gente em{" "}
          <a href="mailto:contato@puriongt.com.br" className="underline">
            contato@puriongt.com.br
          </a>{" "}
          ou pelo WhatsApp.
        </p>
      </section>
    </LegalLayout>
  );
}
