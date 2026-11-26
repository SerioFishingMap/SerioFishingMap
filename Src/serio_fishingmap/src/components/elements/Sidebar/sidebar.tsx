"use client";

import {
  Box,
  Flex,
  Icon,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { IconType } from "react-icons"; // アイコンの型
import { FiHome, FiMenu, FiSettings, FiUser } from "react-icons/fi"; // 使用するアイコン
import type { SidebarItemData } from "./sidebar.data";
import { sidebarItemsData } from "./sidebar.data"; // サイドバーのリンクデータ

// アイコン名と実際のコンポーネントを結び付けるマップ
const iconComponents: Record<string, IconType> = {
  FiHome: FiHome,
  FiUser: FiUser,
  FiSettings: FiSettings,
};

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const HEADER_HEIGHT = 76; // ヘッダーに隠れないよう余白を確保
  const sidebarWidth = isExpanded ? "240px" : "72px";

  return (
    <Box display="flex" minH="100vh">
      <Box
        as="nav"
        position="fixed"
        left={0}
        top={`${HEADER_HEIGHT.toString()}px`}
        h={`calc(100vh - ${HEADER_HEIGHT.toString()}px)`}
        bg="gray.800"
        color="white"
        w={sidebarWidth}
        px={3}
        py={4}
        transition="width 0.2s ease"
        overflow="hidden"
        boxShadow="lg"
        display="flex"
        flexDirection="column"
        zIndex={10}
      >
        <Flex
          align="center"
          justify={isExpanded ? "space-between" : "center"}
          mb={6}
          gap={2}
        >
          {isExpanded && (
            <Text fontSize="lg" fontWeight="bold">
              ナビゲーション
            </Text>
          )}
          <IconButton
            aria-label="サイドバーの表示を切り替え"
            icon={<FiMenu />}
            size="sm"
            variant="ghost"
            colorScheme="whiteAlpha"
            onClick={() => {
              setIsExpanded((prev) => !prev);
            }}
          />
        </Flex>

        <VStack align="stretch" spacing={2} flex="1">
          {/* itemデータをSidebarItemDataとして扱う */}
          {sidebarItemsData.map((item: SidebarItemData) => {
            // item.iconNameから実際のアイコンコンポーネントを取得
            const IconComponent = iconComponents[item.iconName];

            return (
              <Link
                key={item.label}
                href={item.href}
                _hover={{ textDecoration: "none", bg: "gray.700" }}
                px={isExpanded ? 3 : 0}
                py={2}
                borderRadius="md"
                display="flex"
                alignItems="center"
                gap={isExpanded ? 3 : 0}
                justifyContent="center"
                aria-label={item.label}
              >
                {/* IconComponentが存在する場合のみ描画 */}
                <Icon as={IconComponent} boxSize={5} />
                {isExpanded && <Text>{item.label}</Text>}
              </Link>
            );
          })}
        </VStack>
      </Box>

      <Box w={sidebarWidth} aria-hidden="true" />
    </Box>
  );
};
