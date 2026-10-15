import LegalLayout from "@/components/legal/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Política de Privacidade" updatedAt="14 de outubro de 2026">
      <section>
        <p>
          Esta Política de Privacidade descreve como a PURION GT (&ldquo;nós&rdquo;) coleta, usa, compartilha e
          protege as informações pessoais de quem visita puriongt.com.br, faz uma compra ou entra em contato com a
          gente pelos nossos canais. Ao usar nosso site, você concorda com o que está descrito aqui. Tratamos seus
          dados de acordo com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">Alterações nesta política</h2>
        <p className="mt-3">
          Podemos atualizar esta política de tempos em tempos, por exemplo quando mudamos de parceiro de pagamento
          ou passamos a oferecer um novo canal de atendimento. A data da última atualização está sempre no topo
          desta página.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">Quais informações coletamos</h2>
        <p className="mt-3">Coletamos informações em três situações:</p>
        <ul className="mt-3 flex flex-col gap-2 pl-5 list-disc">
          <li>
            <strong>Diretamente de você</strong>: nome, e-mail, telefone/WhatsApp, endereço de entrega e dados de
            pagamento quando você compra, assina nossa lista de lançamentos ou fala com a gente pelo WhatsApp.
          </li>
          <li>
            <strong>Automaticamente</strong>: dados de navegação (páginas visitadas, origem do acesso, dispositivo)
            coletados por cookies e ferramentas de análise, para entender como o site está sendo usado.
          </li>
          <li>
            <strong>De terceiros</strong>: nosso processador de checkout e pagamento e nossa transportadora podem nos
            repassar informações sobre o status de um pedido (confirmação de pagamento, código de rastreio).
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">Como usamos suas informações</h2>
        <ul className="mt-3 flex flex-col gap-2 pl-5 list-disc">
          <li>Processar seu pedido, emitir nota fiscal e providenciar a entrega;</li>
          <li>Responder suas dúvidas pelo WhatsApp ou e-mail;</li>
          <li>
            Enviar novidades, lançamentos e condições exclusivas, quando você se cadastra na nossa lista — você pode
            cancelar o recebimento quando quiser;
          </li>
          <li>Entender o comportamento de navegação para melhorar o site;</li>
          <li>Cumprir obrigações legais e fiscais.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">Cookies</h2>
        <p className="mt-3">
          Usamos cookies para lembrar suas preferências e entender como o site é usado. A maioria dos navegadores
          permite bloquear ou apagar cookies nas configurações — isso pode afetar algumas funcionalidades do site.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">Com quem compartilhamos seus dados</h2>
        <p className="mt-3">Compartilhamos informações apenas com quem precisa delas para o site funcionar:</p>
        <ul className="mt-3 flex flex-col gap-2 pl-5 list-disc">
          <li>Processadores de pagamento e checkout, para aprovar e processar sua compra;</li>
          <li>Transportadoras e serviços de logística, para entregar seu pedido;</li>
          <li>Ferramentas de e-mail e CRM, para o envio de comunicações que você autorizou;</li>
          <li>Autoridades públicas, quando exigido por lei.</li>
        </ul>
        <p className="mt-3">Nunca vendemos seus dados pessoais a terceiros.</p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">Depoimentos e conteúdo enviado por você</h2>
        <p className="mt-3">
          Se você enviar um depoimento pelo site, o nome, a cidade e o texto que você escrever podem ser exibidos
          publicamente na página de avaliações. Não publique informações sensíveis que não queira tornar públicas.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">Crianças</h2>
        <p className="mt-3">
          Nosso site não é direcionado a menores de 18 anos e não coletamos intencionalmente dados de crianças. Se
          você acredita que coletamos dados de um menor, entre em contato para que possamos removê-los.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">Segurança e retenção</h2>
        <p className="mt-3">
          Adotamos medidas técnicas e administrativas razoáveis para proteger seus dados. Guardamos suas informações
          apenas pelo tempo necessário para as finalidades descritas aqui ou enquanto exigido por lei (por exemplo,
          obrigações fiscais).
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">Seus direitos (LGPD)</h2>
        <p className="mt-3">Você pode, a qualquer momento, solicitar:</p>
        <ul className="mt-3 flex flex-col gap-2 pl-5 list-disc">
          <li>Confirmação de que tratamos seus dados e acesso a eles;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Exclusão dos seus dados, exceto quando a lei exigir que os mantenhamos;</li>
          <li>Portabilidade dos dados a outro fornecedor;</li>
          <li>Revogação do consentimento (por exemplo, para parar de receber nossos e-mails).</li>
        </ul>
        <p className="mt-3">
          Para exercer qualquer um desses direitos, escreva para{" "}
          <a href="mailto:puriongt@gmail.com" className="underline">
            puriongt@gmail.com
          </a>{" "}
          ou fale com a gente no WhatsApp.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">Reclamações</h2>
        <p className="mt-3">
          Se você tiver uma reclamação sobre como tratamos seus dados, fale primeiro com a gente — queremos
          resolver diretamente. Você também tem o direito de apresentar uma reclamação à Autoridade Nacional de
          Proteção de Dados (ANPD).
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium text-ink-950">Contato</h2>
        <p className="mt-3">
          Dúvidas sobre esta política? Fale com a gente em{" "}
          <a href="mailto:puriongt@gmail.com" className="underline">
            puriongt@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
