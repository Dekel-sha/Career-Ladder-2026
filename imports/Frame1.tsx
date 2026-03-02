function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[17px] items-center relative shrink-0 w-[97px]">
      <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#323338] text-[18px] text-center tracking-[-0.1px] w-full">
        <p className="leading-[24px]">Primary</p>
      </div>
      <div className="bg-[#0073ea] h-[48px] max-h-[48px] min-h-[48px] relative rounded-[4px] shrink-0 w-full" data-name="Button">
        <div className="flex flex-row items-center justify-center max-h-inherit min-h-inherit size-full">
          <div className="box-border content-stretch flex gap-[8px] h-[48px] items-center justify-center max-h-inherit min-h-inherit px-[24px] py-0 relative w-full">
            <div className="flex flex-col font-['Figtree:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-nowrap text-white">
              <p className="leading-[22px] whitespace-pre">Button</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[17px] items-center relative shrink-0 w-[100px]">
      <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#323338] text-[18px] tracking-[-0.1px] w-full">
        <p className="leading-[24px]" dir="auto">
          Secondary
        </p>
      </div>
      <div className="h-[48px] max-h-[48px] min-h-[48px] relative rounded-[4px] shrink-0 w-full" data-name="Button">
        <div aria-hidden="true" className="absolute border border-[#c3c6d4] border-solid inset-0 pointer-events-none rounded-[4px]" />
        <div className="flex flex-row items-center justify-center max-h-inherit min-h-inherit size-full">
          <div className="box-border content-stretch flex gap-[8px] h-[48px] items-center justify-center max-h-inherit min-h-inherit px-[24px] py-0 relative w-full">
            <div className="flex flex-col font-['Figtree:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#323338] text-[16px] text-nowrap">
              <p className="leading-[22px] whitespace-pre">Button</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-white relative size-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[76px] items-center justify-center px-[84px] py-[38px] relative size-full">
          <Frame2 />
          <Frame3 />
        </div>
      </div>
    </div>
  );
}