"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Image,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type CustomCardProps = {
  title: string;
  description: string;
  imageObjectUrl: string; // Blob URL を渡す
  footer?: React.ReactNode;
  navigateTo?: string; // クリック時遷移先パス
};

export const CustomCard = ({
  title,
  description,
  imageObjectUrl,
  footer,
  navigateTo,
}: CustomCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (navigateTo) {
      router.push(navigateTo);
    }
  };

  return (
    <Card
      onClick={handleClick}
      cursor="pointer"
      w="200px"
      h="250px"
      boxShadow="md"
      _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
      transition="all 0.2s"
    >
      <CardHeader p={0}>
        <Image
          src={imageObjectUrl}
          alt={title}
          borderTopRadius="md"
          objectFit="cover"
          h="150px"
          w="100%"
        />
      </CardHeader>
      <CardBody p={4}>
        <Stack spacing={3}>
          <Heading size="sm">{title}</Heading>
          <Text fontSize="sm" color="gray.600">
            {description}
          </Text>
        </Stack>
      </CardBody>
      {footer && <CardFooter p={4}>{footer}</CardFooter>}
    </Card>
  );
};
