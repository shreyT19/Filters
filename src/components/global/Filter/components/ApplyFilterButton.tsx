import { Button, type ButtonProps } from "~/components/ui/button";
import { FILTER_V2_TEST_IDS } from "~/utils/filter.utils";

const ApplyFilterButton = (props: ButtonProps) => {
  //   useKeyboardShortcut(
  //     "Enter",
  //     (e) => {
  //       if (!props.disabled) {
  //         props?.onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
  //       }
  //     },
  //     true
  //   );

  return (
    <Button
      {...props}
      variant="ghost"
      size="sm"
      //   tooltipProps={{
      //     placement: "right",
      //   }}
      //   endIcon={<KeyboardShortcut targetKey="enter" />}
      //   dataTestId={FILTER_V2_TEST_IDS.filterApplyButton}
    >
      Apply Filter
    </Button>
  );
};

export default ApplyFilterButton;
