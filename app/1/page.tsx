import Nav from "@/components/sections/Nav";
import React from "react";

const changelogEntries = [
  {
    date: "11 Nov - 2024",
    title: "New AI-Powered Features",
    image:
      "https://assets.lummi.ai/assets/QmSvARYf4xpDZSZHu82DhuHLMiunzsSNzsSyTZto7H691W?auto=format&w=1500",
    description:
      "We're excited to introduce our new AI-powered capabilities that transform how you interact with your data. Our advanced machine learning algorithms now provide intelligent insights, predictive analytics, and automated recommendations, making your workflow more efficient than ever. Experience the future of data analysis with our cutting-edge AI integration.",
  },
  {
    date: "21 Oct - 2024",
    title: "Advanced Data Visualization",
    image:
      "https://assets.lummi.ai/assets/QmTzN9YhtsUdmQXXe8p8w4FCsbK2bdBqXUGVuaqePecDwu?auto=format&w=1500",
    description:
      "Transform your data into compelling visual stories with our new advanced visualization tools. Create stunning interactive charts, customizable dashboards, and real-time data representations. Perfect for presenting complex information in an intuitive, engaging format that helps stakeholders make informed decisions quickly.",
  },
  {
    date: "12 Oct - 2024",
    title: "Enhanced Collaboration Tools",
    image:
      "https://assets.lummi.ai/assets/QmWuo12YhRPYcxdb8oPVBreMnr7nQrb7tx4stPrenoG1Qt?auto=format&w=1500",
    description:
      "Collaboration just got easier with our new suite of team-focused tools. Share projects seamlessly, work together in real-time, and maintain version control effortlessly. New features include live editing, comment threads, and integrated task management to keep your team aligned and productive.",
  },
  {
    date: "15 Sep - 2024",
    title: "Performance Optimization",
    image:
      "https://assets.lummi.ai/assets/QmdHyfNc8Su5zMugjKHWgAqgRT1unRkfxCbS8Jvj1bz8dm?auto=format&w=1500",
    description:
      "Experience lightning-fast performance with our latest optimization update. We've significantly improved load times, reduced resource usage, and enhanced overall system efficiency. Users can now enjoy smoother navigation and faster data processing, making your workflow more efficient than ever.",
  },
  {
    date: "03 Sep - 2024",
    title: "Custom Workflow Builder",
    image:
      "https://assets.lummi.ai/assets/QmVmJhAZCm4NYLjnCAmuVnm4ykpE6vwrk4xGaRp8DdLL9f?auto=format&w=1500",
    description:
      "Take control of your processes with our new Custom Workflow Builder. Design and implement tailored workflows that match your exact needs. Drag-and-drop interface, conditional logic, and automated actions make it easy to create complex processes without coding knowledge.",
  },
];

const page = () => {
  return (
    <section className="min-h-screen">
      <Nav />
      <div className="lg:px-16 mx-auto max-w-5xl space-y-4 divide-y divide-[var(--border)] px-4 text-neutral-500 md:px-12">
        <div>
          <h1 className="text-2xl font-[500] text-foreground">Updates</h1>
          <p className="">
            Stay up to date with our latest features and improvements. We're
            constantly evolving to provide you with the best possible experience
            and powerful new capabilities.
          </p>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {changelogEntries.map((data, index) => (
            <article
              key={index}
              className="flex gap-4 pt-12 first:pt-0 md:gap-12"
            >
              <aside className="sticky top-8 h-fit pb-8">
                <time
                  className="block truncate pt-8 text-sm md:text-base"
                  dateTime={data.date}
                >
                  {data.date}
                </time>
              </aside>

              <div className="w-full py-8">
                <figure className="mx-auto space-y-4 xs:space-y-0 md:space-y-6">
                  <img
                    className="aspect-[3/1] w-full select-none rounded-lg object-cover"
                    src={data.image}
                    alt={data.title}
                  />
                  <figcaption className="space-y-2 xs:space-y-0 md:space-y-4">
                    <h1 className="text-2xl font-[500] text-foreground">
                      {data.title}
                    </h1>
                    <p className="line-clamp-4 leading-[120%] xs:leading-[110%]">
                      {data.description}
                    </p>
                    <a className="inline-block hover:underline" href="#_">
                      Read more
                    </a>
                  </figcaption>
                </figure>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default page;
