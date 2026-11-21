export const noteProseStyles =
  "text-base text-foreground leading-loose [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_blockquote]:mb-6 [&_blockquote]:border-input [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:text-foreground-sub [&_blockquote>p:last-child]:mb-0 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-28 xl:[&_h2]:scroll-mt-20 [&_h2]:font-bold [&_h2]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-28 xl:[&_h3]:scroll-mt-20 [&_h3]:font-bold [&_h3]:text-lg [&_li>p]:mb-1 [&_li_ol]:mb-0 [&_li_ul]:mb-0 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-6 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6";

export const notebookProseStyles = [
  "break-words text-[15px] leading-7 lg:text-base [&_strong]:font-bold",
  "[&>*]:m-0 [&>:is(h2,h3,ul,ol,blockquote):not(:first-child)]:mt-7 [&>:is(ul,ol,blockquote)]:mb-7 [&>blockquote:not(:first-child)]:mt-11 [&>:is(h2,h3)+:not(blockquote)]:mt-0!",
  "[&>:is(h2,h3)]:font-bold [&>:is(h2,h3)]:font-display [&>:is(h2,h3)]:leading-7",
  "[&>h2]:flex [&>h2]:items-center [&>h2]:gap-2 [&>h2]:text-[17px] lg:[&>h2]:gap-2.5 lg:[&>h2]:text-[19px] [&>h2]:before:h-0.5 [&>h2]:before:w-3 [&>h2]:before:shrink-0 [&>h2]:before:bg-primary [&>h2]:before:content-[''] lg:[&>h2]:before:w-4",
  "[&>h3]:text-base lg:[&>h3]:text-[17px]",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6",
  "[&>blockquote]:relative [&>blockquote]:ml-auto [&>blockquote]:w-full [&>blockquote]:max-w-85 [&>blockquote]:bg-[#e4e5d3] [&>blockquote]:px-6 [&>blockquote]:pt-5.5 [&>blockquote]:pb-5 [&>blockquote]:font-display [&>blockquote]:text-[15px] [&>blockquote]:leading-[1.75] [&>blockquote]:shadow-[0_8px_16px_rgb(10_41_71/0.13)] lg:[&>blockquote]:text-base",
  "[&>blockquote]:before:absolute [&>blockquote]:before:-top-2.75 [&>blockquote]:before:left-1/2 [&>blockquote]:before:h-5.5 [&>blockquote]:before:w-21 [&>blockquote]:before:-translate-x-1/2 [&>blockquote]:before:bg-[rgb(139_94_60/0.26)] [&>blockquote]:before:content-['']",
].join(" ");
