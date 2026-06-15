import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

type MockComponentProps = React.PropsWithChildren<{
  asChild?: boolean;
  className?: string;
  title?: string;
  description?: string;
  label?: string;
  valueCents?: number;
}>;

function createComponent(tagName: keyof React.JSX.IntrinsicElements) {
  return function MockComponent({ asChild, children, ...props }: MockComponentProps) {
    if (asChild && React.isValidElement(children)) {
      return children;
    }

    return React.createElement(tagName, props, children);
  };
}

vi.mock("@w1zll/shop-ui", () => ({
  Badge: createComponent("span"),
  Button: createComponent("button"),
  Card: createComponent("article"),
  CardContent: createComponent("div"),
  CardDescription: createComponent("p"),
  CardHeader: createComponent("div"),
  CardTitle: createComponent("h3"),
  Container: createComponent("div"),
  EmptyState: ({ title, description, children }: MockComponentProps) =>
    React.createElement("section", null, title, description, children),
  ErrorState: ({ title, description }: MockComponentProps) =>
    React.createElement("section", null, title, description),
  Input: createComponent("input"),
  LoadingState: ({ label, title, description }: MockComponentProps) =>
    React.createElement("section", null, label, title, description),
  Price: ({ valueCents }: MockComponentProps) =>
    React.createElement("span", null, `${String(valueCents)} cents`),
  Skeleton: createComponent("div"),
  Toaster: () => null,
}));
