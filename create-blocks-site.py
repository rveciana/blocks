import requests
import json
import os
import tempfile
from slugify import slugify


def prepare_files(out_dir, api_file):
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    with open(api_file, 'r', encoding="utf-8") as fp:
        blocks = json.load(fp)

        for block in blocks:
            print("files for ", block['description'])
            slug = slugify(block['description'])
            block_dir = f"{out_dir}/{slug}"
            if not os.path.exists(block_dir):
                os.makedirs(block_dir)

            # print(block['description'], block_dir)
            for block_file in block['files'].values():
                if not os.path.exists(f"{block_dir}/{block_file['filename']}"):
                    print(block_file['filename'])
                    req = requests.get(
                        block_file['raw_url'], allow_redirects=True, timeout=10)
                    open(
                        f"{block_dir}/{block_file['filename']}", 'wb').write(req.content)


def create_index(username, api_file):
    with open(api_file, 'w') as fp:
        url = f"https://api.github.com/users/{username}/gists"

        out_data = []
        is_last = False

        while is_last is False:
            req = requests.get(url, allow_redirects=True, timeout=10)
            print("downloading", url)

            page_content = json.loads(req.content)

            page_content_slug = [
                {**x, 'slug': slugify(x['description'])} for x in page_content]

            out_data += page_content_slug

            if 'next' in req.links:
                url = req.links['next']['url']
            else:
                json.dump(out_data, fp)
                is_last = True


def create_blocks(out_dir, username, api_file='api_result.json'):
    # create_index(username, api_file)
    prepare_files(out_dir, api_file)


if __name__ == '__main__':
    create_blocks('out', 'rveciana')
