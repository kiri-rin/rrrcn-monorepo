//@ts-ignore
import ee from "@google/earthengine";
/* eslint-disable-next-line no-restricted-globals */
globalThis.window = self;
const key = {
  type: "service_account",
  project_id: "rrrcn2022",
  private_key_id: "dab3584047626156c9a059d7e52ca1b3d0d3da48",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQysJPhZwYA0IH\npwswEg6yH41wuX1gUKutEbe1mK/Vm1tnLXAW6ggUAJXXBqKODyTfkvmW8oGNSACd\nRjrkYM7E4u6u563+sjllLkFzxEGE0X/FMn19WMlkc2NUAL27FBVI8EXx3qCxHUbw\nOtu2796cAmLmSDzkFWUf9lnwtFxI4xDyTQBq9VVMF6gxq9HxLoWHVpBH4dw5hqcJ\nrNQwq3GzgHimozavDDNXvzqsapr92tw98U6sVeQ4gkRS8SxVSmEgRMxXTphOj5Sg\n5xE6Fq87s5pK68Lbf8u8X99m7G7H6YJv7wpSdj/CaE7hgBOJHy5GkelqzYYW3bxP\nZi50Sh9rAgMBAAECggEALdKB6I/rHP4CDMnlU6xy2za/hODAmlW6B6aeydTzqg6J\nddBsDCtakIE8YU+Md17teb+41R7tvcLyl5GlNR/l4SHoviwMbJxSqlkHdk+5DVwp\nDW8ySUMmF8yXHQV4nkkfDr3kq9tvKs/BFNHmDHUCRvzjFaT+8BOd+PDI9mGu6zO8\nS5oMIVOS4+J2quffy+4AsKTVlrYzK8s6qKWekpYXGrk6/kGRWTYoINhFegMvDFFo\nmnYOQOcnLeBrjNSMCdSfBVJMMlPbN/TbSV3R3ePBhHqv9N/kDP9akwKmdnJSIHum\nK4eLIOE8Kq68CCveprUDYJLASbTnhonOszB9RwdwOQKBgQD9Knh038VYpXlOArIA\nxHwDY51tGyejru+SWB0rS0uqzQC8G5usEOm6/I4T55rVivbhI50tpBWS8G1R7pA3\nrTYfk0FabIVQYSQDIK8NrMYqpqcQKCN/XLK6RACoIgEDvKiSjDFtYVvBSj9Np1pL\nykMwS+MkNTIBjaMqifMZl8zVrQKBgQDTIR7lOaN/SSsqnlndWjrs0GFCuOWLkqVY\n77WoAJy+SgGMUUe7H5OFolOfOdg+D/Bex0SK2MZOKo+OG/i15CyEuXgbWbmk1ycO\ndlIe3EtidS99GN7+eT2ZjaMy6CNrtLzbwYlYFquWxCUcqCDILiSy258cIWuU2YNh\nSZWaUz98dwKBgQC85uTMqG/zjj0uVVqGshWq3biIwdtZCl4ef3r8ZAmI38Ctm5gT\n0ubkLDDDb2yb7D38jftpI+cpJhccLHsV4DvjYZhBJXpwGJurbcbQ2FthVcqQhrK+\nBOgjjjxDOGQzaqEKAGudJyk01/bWNYptxPVPY0CQMtUmTY4zXo2zSg6AXQKBgHO1\nKiZ8UUN4CSVBRYTPZ43TogocJQk6JE46iTb6puyOyIxrG0HNS18omGWiIQXaXGTF\nFqZ1qTC7mJNMdyDQXSmcL9vlb52MoIYHiHgLSXE7QfxwPf3+2iimfDNxD8B+fCZ/\nydKyEfX9p00uQ1ESIOC5Blk3Y6tfDeaqmkfKqfd/AoGBAL6w2IHymc+LKnUF/JqJ\nelXkzRIb8IzS+wKZRvZJDbk7sJRJ/iX12u52gFJpXP6z1QjW1viBuJ6XoGQoNIc6\nb6nLHH1z9W6POrYoeTaQLx7+A4nW2utXFCc/HTm2BrNOzSCsnNOGAuJ8+OENCqaN\nsDoTSWDRUN9gHD485t4g8liF\n-----END PRIVATE KEY-----\n",
  client_email: "rrrcn-dev@rrrcn2022.iam.gserviceaccount.com",
  client_id: "104023878320312395811",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/rrrcn-dev%40rrrcn2022.iam.gserviceaccount.com",
};

/* eslint-disable-next-line no-restricted-globals */
self.onmessage = (e) => {
  console.log("WORKER", JSON.stringify(e.data));
  console.log("WORKER", JSON.stringify(ee));
  //
  // try {
  //   ee.data.authenticateViaPrivateKey(
  //     key,
  //     () => {
  //       ee.initialize(null, null, () => {
  //         const collection = ee.FeatureCollection(e.data[0]);
  //         collection.evaluate((res: any) => {
  //           console.log(JSON.stringify(res));
  //         });
  //       });
  //     },
  //     (r: string) => {
  //       console.log(r);
  //     }
  //   );
  // } catch (e) {
  //   console.log("AAAAAAAAA");
  //   console.log(e);
  // }
};
export {};
