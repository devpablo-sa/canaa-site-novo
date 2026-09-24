import { NewsletterForm } from "canaa";

// NewsletterForm is only ever composed inside Footer's dark navy band — its
// white-on-transparent styling relies on that backdrop (see Footer.tsx).
function Default() {
  return (
    <div className="bg-navy-900 p-8">
      <p className="font-display text-lg text-white mb-1">Inscreva-se na newsletter</p>
      <p className="text-sm text-blue-mist-light mb-4">
        Receba as novidades e conteúdos exclusivos diretamente em seu e-mail.
      </p>
      <div className="sm:w-80">
        <NewsletterForm />
      </div>
    </div>
  );
}

export { Default };
