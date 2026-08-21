import { useAppForm } from "@/components/form";
import { DUMMY_GROUP } from "@/lib/constants";
import { IconEmail } from "@/lib/image";
import { VEmail, VPrice, VRequired } from "@/lib/validation";

export default function OvForm() {
  const form = useAppForm({
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField
        name="name"
        children={(f) => <f.FInput label="Name" placeholder="insert name" />}
        validators={{ onChange: VRequired }}
      />
      <form.AppField
        name="email"
        children={(f) => (
          <f.FInput label="Email" icon={IconEmail} placeholder="insert name" />
        )}
        validators={{ onChange: VEmail }}
      />
      <form.AppField
        name="price"
        children={(f) => (
          <f.FInputPrice label="Price" placeholder="insert name" />
        )}
        validators={{ onChange: VPrice }}
      />
      <form.AppField
        name="eat"
        children={(f) => (
          <f.FSelect label="Eat" placeholder="select" groups={DUMMY_GROUP} />
        )}
        validators={{ onChange: VRequired }}
      />
      <form.SubmitBtn />
    </form>
  );
}
