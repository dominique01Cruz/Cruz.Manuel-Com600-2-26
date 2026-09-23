package com.grupo1.api_empleados.grpc;

import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

import java.util.ArrayList;
import java.util.List;

@GrpcService
public class EmpleadoGrpcService extends EmpleadoServiceGrpc.EmpleadoServiceImplBase {

    private final List<EmpleadoResponse> empleados = new ArrayList<>();

    public EmpleadoGrpcService() {
        empleados.add(EmpleadoResponse.newBuilder()
                .setId(1L).setNombre("Manuel Cruz").setPuesto("Backend Dev").setSalario(5000.0).build());
        empleados.add(EmpleadoResponse.newBuilder()
                .setId(2L).setNombre("Richard Chavez").setPuesto("Frontend Dev").setSalario(4500.0).build());
    }

    @Override
    public void getEmpleado(EmpleadoRequest request, StreamObserver<EmpleadoResponse> responseObserver) {
        EmpleadoResponse respuesta = empleados.stream()
                .filter(e -> e.getId() == request.getId())
                .findFirst()
                .orElse(EmpleadoResponse.newBuilder().setId(0).setNombre("No encontrado").build());

        responseObserver.onNext(respuesta);
        responseObserver.onCompleted();
    }

    @Override
    public void listEmpleados(Empty request, StreamObserver<EmpleadoListResponse> responseObserver) {
        EmpleadoListResponse respuesta = EmpleadoListResponse.newBuilder()
                .addAllEmpleados(empleados)
                .build();

        responseObserver.onNext(respuesta);
        responseObserver.onCompleted();
    }
}