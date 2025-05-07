"use client";
import { useEffect } from "react";
import { Button, type ButtonProps } from "~/components/ui/button";
import { FILTER_V2_TEST_IDS } from "~/utils/filter.utils";

const ApplyFilterButton = (props: ButtonProps) => {
  useEffect(() => {
    const handleEnterPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !props.disabled) {
        props?.onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    };

    window.addEventListener("keydown", handleEnterPress);
    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [props.disabled, props.onClick]);

  return (
    <Button
      {...props}
      variant="ghost"
      size="sm"
      //   tooltipProps={{
      //     placement: "right",
      //   }}
      //   endIcon={<KeyboardShortcut targetKey="enter" />}
        dataTestId={FILTER_V2_TEST_IDS.filterApplyButton}
    >
      Apply Filter
    </Button>
  );
};

export default ApplyFilterButton;
