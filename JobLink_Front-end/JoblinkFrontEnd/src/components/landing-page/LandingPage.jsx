/* eslint-disable react/no-unescaped-entities */
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import landingfindworkSVG from "../../assets/landingfindwork.svg";
import searchTalent from "../../assets/searching-talent@1x.webp";

const LandingPage = () => {
  const testimonials = [
    {
      company: "PerfectServe",
      color: "bg-teal-700",
      quote:
        "If we didn't have JobLink...the quality of talent wouldn't be as easy to measure, and we wouldn't have the incredible support we get from the JobLink team.",
      author: "Jessica Khawaja, VP of People Operations",
      results: [
        {
          title: "11 days",
          description:
            "to post a job, hire, classify, and onboard selected talent",
        },
        {
          title: "Nearly Doubled",
          description: "the support hours for a project",
        },
      ],
    },
    {
      company: "Microsoft",
      color: "bg-orange-600",
      quote:
        "One of the advantages of utilizing freelancers is finding talent with different skills quickly as our needs change.",
      author: "Carol Taylor, Director of Content Experience",
      results: [
        { title: "50% Faster", description: "launch of projects" },
        { title: "10,000", description: "projects completed" },
      ],
    },
    {
      company: "Airbnb",
      color: "bg-red-600",
      quote:
        "JobLink enables us to differentiate ourselves from our competitors and produce content at a higher caliber.",
      author: "Mike Volpe, CEO",
      results: [
        { title: "30% Cost Savings", description: "on content production" },
        {
          title: "5x Faster",
          description: "content delivery compared to traditional methods",
        },
      ],
    },
  ];
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const sliderRef = useRef();

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  function handleRegisterBtn(){
    window.location.href = "/auth/register";
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-center">
        <div className="lg:w-1/2 mb-8 lg:mb-0  lg:text-left ml-10">
          <h1 className="text-4xl font-bold mb-2">How work should work</h1>
          <p className="text-lg text-gray-600 mb-4">
            Forget the old rules. You can have the best people. Right now. Right
            here.
          </p>
          <Button size="lg">Get started</Button>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="https://res.cloudinary.com/upwork-cloud-acquisition-prod/image/upload/c_scale,w_440,h_300,f_auto,q_auto,dpr_2.0/brontes/hero/searching-talent@1x.png"
            alt="Remote work illustration"
            className="w-full max-w-xs"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <img
              src={landingfindworkSVG}
              alt="Job posting example"
              className="w-full"
            />
          </div>
          <div className="lg:w-1/2 lg:pl-10">
            <h2 className="text-4xl font-bold mb-8">
              Up your work game, it's easy
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <DollarSign className="mr-4 " size={24} />
                <div>
                  <h3 className="text-xl font-semibold">No cost to join</h3>
                  <p className="text-gray-600">
                    Register and browse talent profiles, explore projects, or
                    even book a consultation.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="mr-4 " size={24} />
                <div>
                  <h3 className="text-xl font-semibold">
                    Post a job and hire top talent
                  </h3>
                  <p className="text-gray-600">
                    Finding talent doesn't have to be a chore. Post a job or we
                    can search for you!
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Zap className="mr-4 text-green-600" size={24} />
                <div>
                  <h3 className="text-xl font-semibold">
                    Work with the best—without breaking the bank
                  </h3>
                  <p className="text-gray-600">
                    JobLink makes it affordable to up your work and take
                    advantage of low transaction rates.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 space-x-4">
              <Button onClick={handleRegisterBtn} size="lg">Sign up for free</Button>
              <Button size="lg" variant="outline">
                Learn how to hire
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Trusted by leading brands and startups
          </h2>
          <div className="relative">
            <div ref={sliderRef} className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={index}
                    className={`${testimonial.color} text-white flex-shrink-0 w-full px-[60px] py-4`}
                  >
                    <CardContent className="p-4">
                      <p className="text-lg mb-4">{testimonial.quote}</p>
                      <p className="font-semibold">{testimonial.author}</p>
                      <h3 className="text-2xl font-bold mt-6 mb-2">Results</h3>
                      {testimonial.results.map((result, idx) => (
                        <div key={idx}>
                          <p className="text-3xl font-bold mt-4">
                            {result.title}
                          </p>
                          <p className="text-sm">{result.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-black hover:bg-gray-200 hover:text-gray-700 transition-all"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-6 w-6" />{" "}
              {/* Tăng kích thước của icon */}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-black hover:bg-gray-200 hover:text-gray-700 transition-all"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-6 w-6" />{" "}
              {/* Tăng kích thước của icon */}
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`mx-1 rounded-full ${
                  index === currentTestimonial ? "bg-gray-800" : "bg-gray-300"
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" className="text-black">
              See more customer stories{" "}
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
