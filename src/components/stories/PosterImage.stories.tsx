import type { Meta, StoryObj } from "@storybook/react"
import { PosterImage } from "../PosterImage"

const meta: Meta<typeof PosterImage> = {
  title: "Components/PosterImage",
  component: PosterImage,
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
  },
}

export default meta
type Story = StoryObj<typeof PosterImage>

/** Default poster with a sample movie image. */
export const WithImage: Story = {
  args: {
    src: "https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    alt: "Dune: Part Two",
    size: "md",
  },
}

/** Placeholder displayed when no image URL is provided. */
export const Placeholder: Story = {
  args: {
    alt: "Unknown movie",
    size: "md",
  },
}

/** Small size variant. */
export const Small: Story = {
  args: {
    src: "https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    alt: "Dune: Part Two",
    size: "sm",
  },
}

/** Medium size variant (default). */
export const Medium: Story = {
  args: {
    src: "https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    alt: "Dune: Part Two",
    size: "md",
  },
}

/** Large size variant. */
export const Large: Story = {
  args: {
    src: "https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    alt: "Dune: Part Two",
    size: "lg",
  },
}

/** All three sizes displayed side by side for comparison. */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <PosterImage
        src="https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
        alt="Small"
        size="sm"
      />
      <PosterImage
        src="https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
        alt="Medium"
        size="md"
      />
      <PosterImage
        src="https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
        alt="Large"
        size="lg"
      />
    </div>
  ),
}

/** All three placeholder sizes displayed side by side. */
export const AllPlaceholderSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <PosterImage alt="Small placeholder" size="sm" />
      <PosterImage alt="Medium placeholder" size="md" />
      <PosterImage alt="Large placeholder" size="lg" />
    </div>
  ),
}
