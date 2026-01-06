import { motion } from "framer-motion";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";

const heroVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
};

export function HeroIntroSection() {
  return (
    <section className="pt-12 lg:pt-16">
      <div className="grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,0.4fr)] lg:items-start mb-10 lg:mb-12">
        <div className="space-y-4 lg:space-y-6">
          <motion.h1
            variants={heroVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.7 }}
            custom={1}
            className="text-[clamp(3.5rem,8vw,8rem)] font-extrabold leading-[0.95] tracking-[-4px] text-deep"
            style={{
              fontFamily:
                '"Inter Display", "Inter Display Placeholder", sans-serif',
            }}
          >
            Pour, make, bake, <span className="text-[#B0562B]">share.</span>
          </motion.h1>
        </div>
        <motion.div
          variants={heroVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          custom={2}
          className="max-w-sm text-[1.3rem] font-semibold leading-[1.2] text-[#141415] lg:ml-auto lg:pt-20"
          style={{ fontFamily: '"DM Sans","DM Sans Placeholder",sans-serif' }}
        >
          <p>
            Nous travaillons en duo texte &amp; gestes : l&apos;un raconte
            l&apos;origine des grains, l&apos;autre surveille les flammes.
            Ensemble, on compose des moments simples, presque pauvres dans la
            forme, riches dans le goût.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="w-full border border-[#e1d7c8] overflow-hidden"
      >
        <ImageWithSkeleton
          src="https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/001_1U1A0815_DEBORA.jpg?raw=true"
          alt="Bakeat atelier"
          className="w-full h-auto object-cover"
          skeletonClassName="w-full aspect-[16/10]"
        />
      </motion.div>
    </section>
  );
}
