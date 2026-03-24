import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroCTA } from "@/components/hero-cta";

const features = [
  {
    title: "AI-Powered Questions",
    description:
      "Get realistic interview questions tailored to your industry, experience level, and target role. Choose from behavioral, case, and situational formats.",
  },
  {
    title: "Personalized Feedback",
    description:
      "Receive detailed analysis of your answers highlighting strengths and specific areas for improvement with actionable suggestions.",
  },
  {
    title: "STAR Framework Analysis",
    description:
      "For behavioral questions, get a breakdown of your response across Situation, Task, Action, and Result with individual scores.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6 pt-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Master Your
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Behavioral Interviews
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Practice with AI-generated interview questions personalized to your
          background. Get instant, detailed feedback on your answers — including
          STAR framework evaluation for behavioral questions.
        </p>
        <HeroCTA />
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* How it works */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            {
              step: "1",
              title: "Set Up Your Profile",
              desc: "Tell us about your industry, experience, and goals.",
            },
            {
              step: "2",
              title: "Practice Questions",
              desc: "Generate questions by type, difficulty, or job description.",
            },
            {
              step: "3",
              title: "Get AI Feedback",
              desc: "Submit your answer and receive detailed analysis.",
            },
          ].map((item) => (
            <div key={item.step} className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto">
                {item.step}
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
