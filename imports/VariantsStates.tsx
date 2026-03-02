import svgPaths from "./svg-k4twho8w4m";

function Title() {
  return (
    <div
      className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start justify-center min-h-px min-w-px relative shrink-0"
      data-name="Title"
    >
      <p className="font-['Poppins:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[#323338] text-[40px] text-nowrap whitespace-pre">{`Variants & states`}</p>
    </div>
  );
}

function PropContainer() {
  return (
    <div
      className="basis-0 bg-[#f6f7fb] grow min-h-[240px] min-w-px relative rounded-[24px] shrink-0"
      data-name="Prop Container"
    >
      <div className="flex flex-row items-center justify-center min-h-inherit size-full">
        <div className="box-border content-center cursor-pointer flex flex-wrap gap-[32px] items-center justify-center min-h-inherit p-[40px] relative w-full">
          <button
            className="bg-[#0073ea] box-border content-stretch flex flex-col gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
            data-name="Label"
          >
            <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
              Label
            </p>
          </button>
          <button
            className="box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
            data-name="Label"
          >
            <div
              aria-hidden="true"
              className="absolute border border-[#0073ea] border-solid inset-0 pointer-events-none rounded-[4px]"
            />
            <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#0073ea] text-[14px] text-center text-nowrap whitespace-pre">
              Label
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

function VariantSection() {
  return (
    <div
      className="content-stretch flex gap-[64px] items-start relative shrink-0 w-full"
      data-name="Variant Section"
    >
      <div
        className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[400px]"
        data-name="Description"
      >
        <p className="font-['Poppins:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[#323338] text-[24px] w-full">
          Kind
        </p>
      </div>
      <PropContainer />
    </div>
  );
}

function VariantSectionContainer() {
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="Variant Section Container"
    >
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[104px] items-start px-[80px] py-0 relative w-full">
          <VariantSection />
        </div>
      </div>
    </div>
  );
}

function PropContainer1() {
  return (
    <div
      className="basis-0 bg-[#f6f7fb] grow min-h-[240px] min-w-px relative rounded-[24px] shrink-0"
      data-name="Prop Container"
    >
      <div className="flex flex-row items-center justify-center min-h-inherit size-full">
        <div className="box-border content-center flex flex-wrap gap-[32px] items-center justify-center min-h-inherit p-[40px] relative w-full">
          <button
            className="bg-[#0073ea] box-border content-stretch cursor-pointer flex flex-col gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
            data-name="Label"
          >
            <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
              Label
            </p>
          </button>
          <div
            className="bg-[#0060b9] box-border content-stretch flex flex-col gap-[8px] h-[24px] items-center justify-center px-[8px] py-0 relative rounded-[4px] shrink-0"
            data-name="Label"
          >
            <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
              Label
            </p>
          </div>
          <div
            className="bg-[#0060b9] box-border content-stretch flex flex-col gap-[8px] h-[24px] items-center justify-center px-[8px] py-0 relative rounded-[4px] shrink-0"
            data-name="Label"
          >
            <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
              Label
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VariantSection1() {
  return (
    <div
      className="content-stretch flex gap-[64px] items-start relative shrink-0 w-full"
      data-name="Variant Section"
    >
      <div
        className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[400px]"
        data-name="Description"
      >
        <p className="font-['Poppins:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[#323338] text-[24px] w-full">
          State
        </p>
      </div>
      <PropContainer1 />
    </div>
  );
}

function VariantSectionContainer1() {
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="Variant Section Container"
    >
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[104px] items-start px-[80px] py-0 relative w-full">
          <VariantSection1 />
        </div>
      </div>
    </div>
  );
}

function PropContainer2() {
  return (
    <div
      className="basis-0 bg-[#f6f7fb] grow min-h-[240px] min-w-px relative rounded-[24px] shrink-0"
      data-name="Prop Container"
    >
      <div className="flex flex-row items-center justify-center min-h-inherit size-full">
        <div className="box-border content-center flex flex-wrap gap-[32px] items-center justify-center min-h-inherit p-[40px] relative w-full">
          <button
            className="bg-[#0073ea] box-border content-stretch cursor-pointer flex flex-col gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
            data-name="Label"
          >
            <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
              Label
            </p>
          </button>
          <div
            className="bg-[#323338] box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center px-[8px] py-0 relative rounded-[4px] shrink-0"
            data-name="Label"
          >
            <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
              Label
            </p>
          </div>
          <button
            className="bg-[#00854d] box-border content-stretch cursor-pointer flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
            data-name="Label"
          >
            <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
              Label
            </p>
          </button>
          <button
            className="bg-[#d83a52] box-border content-stretch cursor-pointer flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
            data-name="Label"
          >
            <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
              Label
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

function VariantSection2() {
  return (
    <div
      className="content-stretch flex gap-[64px] items-start relative shrink-0 w-full"
      data-name="Variant Section"
    >
      <div
        className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[400px]"
        data-name="Description"
      >
        <p className="font-['Poppins:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[#323338] text-[24px] w-full">
          Color
        </p>
      </div>
      <PropContainer2 />
    </div>
  );
}

function VariantSectionContainer2() {
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="Variant Section Container"
    >
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[104px] items-start px-[80px] py-0 relative w-full">
          <VariantSection2 />
        </div>
      </div>
    </div>
  );
}

function PropContainer3() {
  return (
    <div
      className="basis-0 bg-[#f6f7fb] grow min-h-[240px] min-w-px relative rounded-[24px] shrink-0"
      data-name="Prop Container"
    >
      <div className="flex flex-row items-center justify-center min-h-inherit size-full">
        <div className="box-border content-center cursor-pointer flex flex-wrap gap-[32px] items-center justify-center min-h-inherit p-[40px] relative w-full">
          <button
            className="bg-[#0073ea] box-border content-stretch flex flex-col gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
            data-name="Label"
          >
            <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
              Label
            </p>
          </button>
          <button
            className="bg-[#0073ea] box-border content-stretch flex flex-col gap-[8px] items-center justify-center overflow-visible px-[4px] py-0 relative rounded-[2px] shrink-0"
            data-name="Label"
          >
            <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-center text-nowrap text-white whitespace-pre">
              Label
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

function VariantSection3() {
  return (
    <div
      className="content-stretch flex gap-[64px] items-start relative shrink-0 w-full"
      data-name="Variant Section"
    >
      <div
        className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[400px]"
        data-name="Description"
      >
        <p className="font-['Poppins:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[#323338] text-[24px] w-full">
          Size
        </p>
      </div>
      <PropContainer3 />
    </div>
  );
}

function VariantSectionContainer3() {
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="Variant Section Container"
    >
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[104px] items-start px-[80px] py-0 relative w-full">
          <VariantSection3 />
        </div>
      </div>
    </div>
  );
}

function ColorContainer() {
  return (
    <div
      className="content-stretch flex gap-[32px] items-center relative shrink-0"
      data-name="Color Container"
    >
      <button
        className="bg-[#0073ea] box-border content-stretch cursor-pointer flex flex-col gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
          Label
        </p>
      </button>
      <div
        className="bg-white box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#323338] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </div>
      <button
        className="bg-[#258750] box-border content-stretch cursor-pointer flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#323338] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </button>
      <button
        className="bg-[#d83a52] box-border content-stretch cursor-pointer flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#323338] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </button>
    </div>
  );
}

function LineContainer() {
  return (
    <div
      className="content-stretch cursor-pointer flex gap-[32px] items-center relative shrink-0"
      data-name="Line Container"
    >
      <button
        className="box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[#0073ea] border-solid inset-0 pointer-events-none rounded-[4px]"
        />
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#0073ea] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </button>
      <button
        className="box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <div
          aria-hidden="true"
          className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[4px]"
        />
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
          Label
        </p>
      </button>
      <button
        className="box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[#258750] border-solid inset-0 pointer-events-none rounded-[4px]"
        />
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#258750] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </button>
      <button
        className="box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[#d83a52] border-solid inset-0 pointer-events-none rounded-[4px]"
        />
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#d83a52] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </button>
    </div>
  );
}

function PropContainer4() {
  return (
    <div
      className="basis-0 bg-[#181b34] grow min-h-[240px] min-w-px relative rounded-[24px] shrink-0"
      data-name="Prop Container"
    >
      <div className="flex flex-col items-center justify-center min-h-inherit size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-center justify-center min-h-inherit p-[40px] relative w-full">
          <ColorContainer />
          <LineContainer />
        </div>
      </div>
    </div>
  );
}

function VariantSection4() {
  return (
    <div
      className="content-stretch flex gap-[64px] items-start relative shrink-0 w-full"
      data-name="Variant Section"
    >
      <div
        className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[400px]"
        data-name="Description"
      >
        <p className="font-['Poppins:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[#323338] text-[24px] w-full">
          Dark
        </p>
      </div>
      <PropContainer4 />
    </div>
  );
}

function VariantSectionContainer4() {
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="Variant Section Container"
    >
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[104px] items-start px-[80px] py-0 relative w-full">
          <VariantSection4 />
        </div>
      </div>
    </div>
  );
}

function ColorContainer1() {
  return (
    <div
      className="content-stretch flex gap-[32px] items-center relative shrink-0"
      data-name="Color Container"
    >
      <button
        className="bg-[#0073ea] box-border content-stretch cursor-pointer flex flex-col gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
          Label
        </p>
      </button>
      <div
        className="bg-white box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#111111] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </div>
      <button
        className="bg-[#258750] box-border content-stretch cursor-pointer flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#111111] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </button>
      <button
        className="bg-[#d83a52] box-border content-stretch cursor-pointer flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#111111] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </button>
    </div>
  );
}

function LineContainer1() {
  return (
    <div
      className="content-stretch cursor-pointer flex gap-[32px] items-center relative shrink-0"
      data-name="Line Container"
    >
      <button
        className="box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[#0073ea] border-solid inset-0 pointer-events-none rounded-[4px]"
        />
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#0073ea] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </button>
      <button
        className="box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <div
          aria-hidden="true"
          className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[4px]"
        />
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
          Label
        </p>
      </button>
      <button
        className="box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[#258750] border-solid inset-0 pointer-events-none rounded-[4px]"
        />
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#258750] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </button>
      <button
        className="box-border content-stretch flex gap-[8px] h-[24px] items-center justify-center overflow-visible px-[8px] py-0 relative rounded-[4px] shrink-0"
        data-name="Label"
      >
        <div
          aria-hidden="true"
          className="absolute border border-[#d83a52] border-solid inset-0 pointer-events-none rounded-[4px]"
        />
        <p className="font-['Figtree:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#d83a52] text-[14px] text-center text-nowrap whitespace-pre">
          Label
        </p>
      </button>
    </div>
  );
}

function PropContainer5() {
  return (
    <div
      className="basis-0 bg-[#1e2026] grow min-h-[240px] min-w-px relative rounded-[24px] shrink-0"
      data-name="Prop Container"
    >
      <div className="flex flex-col items-center justify-center min-h-inherit size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-center justify-center min-h-inherit p-[40px] relative w-full">
          <ColorContainer1 />
          <LineContainer1 />
        </div>
      </div>
    </div>
  );
}

function VariantSection5() {
  return (
    <div
      className="content-stretch flex gap-[64px] items-start relative shrink-0 w-full"
      data-name="Variant Section"
    >
      <div
        className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[400px]"
        data-name="Description"
      >
        <p className="font-['Poppins:SemiBold',sans-serif] leading-none not-italic relative shrink-0 text-[#323338] text-[24px] w-full">
          Black
        </p>
      </div>
      <PropContainer5 />
    </div>
  );
}

function VariantSectionContainer5() {
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="Variant Section Container"
    >
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[104px] items-start px-[80px] py-0 relative w-full">
          <VariantSection5 />
        </div>
      </div>
    </div>
  );
}

function VariantsContainer() {
  return (
    <div
      className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full"
      data-name="Variants Container"
    >
      <VariantSectionContainer />
      <VariantSectionContainer1 />
      <VariantSectionContainer2 />
      <VariantSectionContainer3 />
      <VariantSectionContainer4 />
      <VariantSectionContainer5 />
    </div>
  );
}

export default function VariantsStates() {
  return (
    <div
      className="bg-white box-border content-stretch flex flex-col gap-[104px] items-start pb-[104px] pt-0 px-0 relative rounded-[32px] size-full"
      data-name="Variants & states"
    >
      <div
        className="relative shrink-0 w-full"
        data-name="Documentation tool kit"
      >
        <div
          aria-hidden="true"
          className="absolute border-[#323338] border-[0px_0px_2px] border-solid inset-0 pointer-events-none"
        />
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex items-center px-[80px] py-[56px] relative w-full">
            <Title />
            <div
              className="box-border content-stretch flex gap-[4px] h-[48px] items-center justify-center pl-[10px] pr-[19px] py-0 relative rounded-[24.869px] shrink-0"
              data-name="Status"
            >
              <div
                aria-hidden="true"
                className="absolute border-2 border-[#323338] border-solid inset-0 pointer-events-none rounded-[24.869px]"
              />
              <div
                className="overflow-clip relative shrink-0 size-[37.527px]"
                data-name="Bullet"
              >
                <div
                  className="absolute inset-[35%]"
                  data-name="Vector"
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 9 9"
                  >
                    <path
                      d={svgPaths.p3ad22aa0}
                      fill="var(--fill-0, #00B267)"
                      id="Vector"
                    />
                  </svg>
                </div>
              </div>
              <p className="font-['Figtree:Regular',sans-serif] font-normal leading-none relative shrink-0 text-[#323338] text-[24px] text-nowrap whitespace-pre">
                Done
              </p>
            </div>
          </div>
        </div>
      </div>
      <VariantsContainer />
    </div>
  );
}