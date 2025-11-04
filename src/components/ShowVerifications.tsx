import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { Badge } from "./ui/badge";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
const ShowVerifications = (
  props: ComponentPropsWithoutRef<"div"> & {
    isAttested: boolean;
    onlySelfAttest?: boolean;
    textClass?: string;
    badge?: boolean;
    fillCheck?: boolean;
    linkClass?: string;
    fillcheckClass?: string;
    mailStatus?:string;
    hash?: string;
  }
) => {
  const {
    className,
    isAttested,
    onlySelfAttest,
    textClass,
    badge,
    fillCheck,
    fillcheckClass,
    mailStatus,
  } = props;
  return (
    <div className={twMerge("flex items-center gap-1", className)}>
      {badge && onlySelfAttest ? (
        <Badge className="text-nowrap self-start">
          <TbRosetteDiscountCheckFilled className="size-4 mr-1" />
          Self attested 
        </Badge>
      ) : (
        <>
          {fillCheck ? (
            <TbRosetteDiscountCheckFilled
              className={twMerge(
                "size-4 mr-1 flex-none self-start",
                fillcheckClass
              )}
            />
          ) : (
            <img src="/verified.svg" alt="verified logo" className="size-5 " />
          )}
          <p
            className={twMerge(
              "text-[#006666] text-sm md:text-base",
              textClass
            )}
          >
            {isAttested && (
              <span className="">Self attested</span>
            )}
            {!onlySelfAttest && (
              <>
                <span className={mailStatus==="pending"?"text-yellow-500":mailStatus==="approved"?"text-green-600":"text-red-500"}> </span>{" "}
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
};

export default ShowVerifications;
