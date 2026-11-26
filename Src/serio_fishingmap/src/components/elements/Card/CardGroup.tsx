import { SimpleGrid } from "@chakra-ui/react";
import { CustomCard } from "./Card";

type CardItem = {
  id: string | number;
  title: string;
  description: string;
  imageObjectUrl: string;
  footer?: React.ReactNode;
  navigateTo?: string;
};

type CustomCardGroupProps = {
  items: CardItem[];
};

export const CustomCardGroup = ({ items }: CustomCardGroupProps) => {
  return (
    <SimpleGrid minChildWidth="200px" spacing={6}>
      {items.map(
        ({ id, title, description, imageObjectUrl, footer, navigateTo }) => (
          <CustomCard
            key={id}
            title={title}
            description={description}
            imageObjectUrl={imageObjectUrl}
            footer={footer}
            navigateTo={navigateTo}
          />
        )
      )}
    </SimpleGrid>
  );
};
