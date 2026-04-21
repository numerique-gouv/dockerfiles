variable "PUBLISHER" {
    default = "mockinghawk"
}

variable "GITHUB_WORKSPACE" {
    default = "."
}

group "default" {
    targets = [
        "cuda12_4_1-rust-ubuntu22_04"
    ]
}

target "cuda12_4_1-rust-ubuntu22_04" {
    context = "${GITHUB_WORKSPACE}/official-templates/cuda-rust"
    dockerfile = "Dockerfile"
    tags = ["${PUBLISHER}/cuda-rust:12.4.1-devel-ubuntu22.04"]
    contexts = {
        scripts = "container-template"
        proxy = "container-template/proxy"
        logo = "container-template"
    }
    args = {
        BASE_IMAGE = "nvidia/cuda:12.4.1-devel-ubuntu22.04"
        PYTHON_VERSION = "3.10"
        CUDA_COMPUTE_CAP = "86"
    }
}
